/* eslint-disable camelcase */
const db = require('../database');
const FilmsRepository = require('../repository/FilmsRepository');
const ActorsRepository = require('../repository/ActorsRepository');
const GenresRepository = require('../repository/GenresRepository');

exports.getAllFilms = (req, res) => {
    const repo = new FilmsRepository(db);
    repo.list()
        .then((films) => {
            res.json({ films });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.getFilmById = (req, res) => {
    const repo = new FilmsRepository(db);
    const filmId = req.params.id;

    repo.get(filmId)
        .then((film) => {
            if (!film) {
                res.status(404).json({ error: 'Film not found' });
            } else {
                res.json(film);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.createFilm = (req, res) => {
    const repoFilms = new FilmsRepository(db);
    const repoActors = new ActorsRepository(db);
    const repoGenres = new GenresRepository(db);
    const {
        genre_id,
        actors_ids,
    } = req.body;

    Promise.all([
        repoFilms.create(req.body),
        repoActors.get(actors_ids),
        repoGenres.get(genre_id),
    ])
        .then(([filmId, actors, genre]) => {
            if (!genre) {
                throw new Error('Genre not found');
            }
            if (actors_ids.length !== actors.length) {
                throw new Error('One or more actors not found');
            }
            res.status(201).json({ success: true, message: 'Film created', filmId });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.updateFilm = (req, res) => {
    const repoFilms = new FilmsRepository(db);
    const repoActors = new ActorsRepository(db);
    const repoGenres = new GenresRepository(db);
    const filmId = req.params.id;
    const {
        genreId,
        actorIds,
    } = req.body;

    Promise.all([
        repoFilms.update(filmId, req.body),
        repoActors.get(actorIds),
        repoGenres.get(genreId),
    ])
        .then(([, actors, genre]) => {
            if (!genre) {
                throw new Error('Genre not found');
            }
            if (actorIds.length !== actors.length) {
                throw new Error('One or more actors not found');
            }
            res.json({ success: true, message: 'Film updated', filmId });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.deleteFilm = (req, res) => {
    const repoFilms = new FilmsRepository(db);
    const filmId = req.params.id;

    repoFilms
        .delete(filmId)
        .then((success) => {
            if (success) {
                res.json({ success: true, message: 'Film deleted', filmId });
            } else {
                res.status(404).json({ error: 'Film not found' });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};
