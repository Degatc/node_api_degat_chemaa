/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable func-names */
class ActorsRepository {
    constructor(database) {
        this.database = database;
    }

    list() {
        return new Promise((resolve, reject) => {
            this.database.all('SELECT * FROM actors', [], (err, rows) => {
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
            this.database.get('SELECT * FROM actors WHERE id = ?', [id], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    create(actorData) {
        const {
            first_name,
            last_name,
            date_of_birth,
            date_of_death,
        } = actorData;

        return new Promise((resolve, reject) => {
            this.database.run(
                'INSERT INTO actors (first_name, last_name, date_of_birth, date_of_death) VALUES (?, ?, ?, ?)',
                [first_name, last_name, date_of_birth, date_of_death],
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

    update(id, actorData) {
        const {
            first_name,
            last_name,
            date_of_birth,
            date_of_death,
        } = actorData;

        return new Promise((resolve, reject) => {
            this.database.run(
                'UPDATE actors SET first_name = ?, last_name = ?, date_of_birth = ?, date_of_death = ? WHERE id = ?',
                [first_name, last_name, date_of_birth, date_of_death, id],
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

    delete(id) {
        return new Promise((resolve, reject) => {
            this.database.run(
                'DELETE FROM actors WHERE id = ?',
                [id],
                (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(err);
                    } else {
                        resolve(true);
                    }
                },
            );
        });
    }
}

module.exports = ActorsRepository;
