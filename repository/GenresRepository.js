/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable func-names */
class GenresRepository {
    constructor(database) {
        this.database = database;
    }

    list() {
        return new Promise((resolve, reject) => {
            this.database.all('SELECT * FROM genres', [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this.database.get('SELECT * FROM genres WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    create(genreData) {
        const {
            name,
        } = genreData;

        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO genres (name) VALUES (?)',
                [name],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                },
            );
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'DELETE FROM genres WHERE id = ?',
                [id],
                function (err) {
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

    checkGenreUsage(id) {
        return new Promise((resolve, reject) => {
            this.database.get(
                'SELECT COUNT(*) as count FROM films WHERE genre_id = ?',
                [id],
                (err, row) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(row.count > 0);
                    }
                },
            );
        });
    }
}

module.exports = GenresRepository;
