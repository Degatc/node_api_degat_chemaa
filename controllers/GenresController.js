const db = require('../database');
const GenresRepository = require('../repository/GenresRepository');

exports.getAllGenres = (req, res) => {
    const repo = new GenresRepository(db);
    repo
        .list()
        .then((genres) => {
            res.json({ genres });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.createGenre = (req, res) => {
    const repo = new GenresRepository(db);

    repo
        .create(req.body)
        .then((genreId) => {
            res
                .status(201)
                .json({ success: true, message: 'Genre created', genreId });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.deleteGenre = (req, res) => {
    const repo = new GenresRepository(db);
    const genreId = req.params.id;

    repo
        .checkGenreUsage(genreId)
        .then((isUsed) => {
            if (isUsed) {
                res.status(400).json({ error: 'Genre is used in one or more films and cannot be deleted' });
            } else {
                repo
                    .delete(genreId)
                    .then((success) => {
                        if (success) {
                            res.json({ success: true, message: 'Genre deleted', genreId });
                        } else {
                            res.status(404).json({ error: 'Genre not found' });
                        }
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};
