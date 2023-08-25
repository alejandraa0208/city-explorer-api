'use strict'

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const WEATHER_API_KEY = process.env.WEATHER_KEY;
const MOVIE_API_KEY = process.env.MOVIE_KEY;

const apiServerURL = 'http://localhost:3001';

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

class Movie {
    constructor(title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn) {
        this.title = title;
        this.overview = overview;
        this.averageVotes = averageVotes;
        this.totalVotes = totalVotes;
        this.imageUrl = imageUrl;
        this.popularity = popularity;
        this.releasedOn = releasedOn;
    }
}

function handleAPIError(res, message) {
    res.status(500).json({ erro: message });
}

function retrieveWeatherData(response) {
    return response.data.slice(0, 5).map(item => {
        return new Forecast(item.valid_date, item.weather.description);
    });
}

function retireveMovieData(response) {
    return response.results.slice(0, 20).map(item => {
        return new Movie(
            item.title,
            item.overview,
            item.vote_average,
            item.vote_count,
            `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
            item.popularity,
            item.release_date
        );
    });
}

app.use(cors());

app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const apiUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lon=${lon}&lat=${lat}`;
        const weatherResponse = await axios.get(apiServerUrl);
        const weatherData = retrieveWeatherData(weatherResponse.data);

        res.json(weatherData);
    } catch (error) {
        handleAPIError(res, 'Error fetching weather data from API');
    }
});

app.get('/movies', async (req, res) => {
    const { searchQuery } = req.query;

    if (!searchQuery) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`;
        const movieResponse = await axios.get(apiServerUrl);
        const movieData = retrieveMovieData(movieResponse.data);

        res.json(movieData);
    } catch (error) {
        handleAPIError(res, 'Error fetching movie data from API');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});