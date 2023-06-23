/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');

const actorsRoutes = require('./routes/actors');
const genresRoutes = require('./routes/genres');
const filmsRoutes = require('./routes/films');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 8000;

app.listen(HTTP_PORT, () => {
    console.log(`Server running on port ${HTTP_PORT}`);
});

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

// Routes
app.use('/api/actor', actorsRoutes);
app.use('/api/genre', genresRoutes);
app.use('/api/film', filmsRoutes);

// Fallback route
app.use((req, res) => {
    res.status(404);
});
