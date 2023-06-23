const express = require('express');
const genresController = require('../controllers/GenresController');

const router = express.Router();

router.get('/', genresController.getAllGenres);
router.post('/', genresController.createGenre);
router.delete('/:id', genresController.deleteGenre);

module.exports = router;
