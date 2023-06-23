const db = require('../database');
const ActorsRepository = require('../repository/ActorsRepository');

exports.getAllActors = (req, res) => {
    const repo = new ActorsRepository(db);
    repo.list()
        .then((actors) => {
            res.json({ actors });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.getActorById = (req, res) => {
    const repo = new ActorsRepository(db);
    const actorId = req.params.id;

    repo.get(actorId)
        .then((actor) => {
            if (!actor) {
                res.status(404).json({ error: 'Actor not found' });
            } else {
                res.json(actor);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.createActor = (req, res) => {
    const repo = new ActorsRepository(db);

    repo.create(req.body)
        .then((actorId) => {
            res.status(201).json({ success: true, message: 'Actor created', actorId });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.updateActor = (req, res) => {
    const repo = new ActorsRepository(db);
    const actorId = req.params.id;

    repo.update(actorId, req.body)
        .then(() => {
            res.json({ success: true, message: 'Actor updated', actorId });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

exports.deleteActor = (req, res) => {
    const repo = new ActorsRepository(db);
    const actorId = req.params.id;

    repo.delete(actorId)
        .then((success) => {
            if (success) {
                res.json({ success: true, message: 'Actor deleted', actorId });
            } else {
                res.status(404).json({ error: 'Actor not found' });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};
