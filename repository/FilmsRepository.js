/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable func-names */

class FilmsRepository {
    constructor(database) {
        this.database = database;
    }

    list() {
        return new Promise((resolve, reject) => {
            this.database.all(
                `SELECT films.id, films.name, films.synopsis, films.release_year, genres.name AS genre, actors.*
                FROM films
                INNER JOIN genres ON films.genre_id = genres.id
                INNER JOIN films_actors ON films.id = films_actors.film_id
                INNER JOIN actors ON films_actors.actor_id = actors.id`,
                [],
                (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                },
            );
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this.database.get(
                `SELECT films.id, films.name, films.synopsis, films.release_year, genres.name AS genre, actors.*
                FROM films
                INNER JOIN genres ON films.genre_id = genres.id
                INNER JOIN films_actors ON films.id = films_actors.film_id
                INNER JOIN actors ON films_actors.actor_id = actors.id
                WHERE films.id = ?`,
                [id],
                (err, row) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(row);
                    }
                },
            );
        });
    }

    create(filmData) {
        const {
            name,
            synopsis,
            release_year,
            genre_id,
            actor_ids,
        } = filmData;

        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO films (name, synopsis, release_year, genre_id) VALUES (?, ?, ?, ?)',
                [name, synopsis, release_year, genre_id],
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        const film_id = this.lastID;
                        this.addActorsToFilm(film_id, actor_ids)
                            .then(() => resolve(film_id))
                            .catch(() => reject(err));
                    }
                },
            );
        });
    }

    update(id, filmData) {
        const {
            name,
            synopsis,
            release_year,
            genre_id,
            actor_ids,
        } = filmData;

        return new Promise((resolve, reject) => {
            this.database.run(
                'UPDATE films SET name = ?, synopsis = ?, release_year = ?, genre_id = ? WHERE id = ?',
                [name, synopsis, release_year, genre_id, id],
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        this.removeActorsFromFilm(id)
                            .then(() => this.addActorsToFilm(id, actor_ids))
                            .then(() => resolve())
                            .catch(() => reject(err));
                    }
                },
            );
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'DELETE FROM films WHERE id = ?',
                [id],
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(this.changes > 0);
                    }
                },
            );
        });
    }

    addActorsToFilm(film_id, actor_ids) {
        return new Promise((resolve, reject) => {
            const promises = [];
            actor_ids.forEach((actor_id) => {
                promises.push(
                    new Promise((resolved, rejected) => {
                        this.database.run(
                            'INSERT INTO film_actors (film_id, actor_id) VALUES (?, ?)',
                            [film_id, actor_id],
                            (err) => {
                                if (err) {
                                    console.error(err.message);
                                    rejected(err);
                                } else {
                                    resolved();
                                }
                            },
                        );
                    }),
                );
            });

            Promise.all(promises)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    removeActorsFromFilm(film_id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'DELETE FROM films_actors WHERE film_id = ?',
                [film_id],
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                },
            );
        });
    }
}

module.exports = FilmsRepository;
