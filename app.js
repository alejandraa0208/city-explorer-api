'use strict'

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { getWeatherData } = require('./weather');
const { getMovieData } = require('./movies');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const weatherData = await getWeatherData(lat, lon);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/movies', async (req, res) => {
    const { searchQuery } = req.query;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const movieData = await getMovieData(searchQuery);
        res.json(movieData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
