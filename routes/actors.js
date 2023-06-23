const express = require('express');
const actorsController = require('../controllers/ActorsController');

const router = express.Router();

router.get('/', actorsController.getAllActors);
router.get('/:id', actorsController.getActorById);
router.post('/', actorsController.createActor);
router.put('/:id', actorsController.updateActor);
router.delete('/:id', actorsController.deleteActor);

module.exports = router;
