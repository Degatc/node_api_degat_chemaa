const express = require('express');
const filmsController = require('../controllers/FilmsController');

const router = express.Router();

router.get('/', filmsController.getAllFilms);
router.get('/:id', filmsController.getFilmById);
router.post('/', filmsController.createFilm);
router.put('/:id', filmsController.updateFilm);
router.delete('/:id', filmsController.deleteFilm);

module.exports = router;
