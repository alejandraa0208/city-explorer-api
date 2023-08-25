const axios = require('axios');
const MOVIE_API_KEY = process.env.MOVIE_KEY;

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

function retrieveMovieData(response) {
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

async function getMovieData(searchQuery) {
    try {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`;
        const movieResponse = await axios.get(apiUrl);
        const movieData = retrieveMovieData(movieResponse.data);

        return movieData;
    } catch (error) {
        throw new Error('Error fetching movie data from API');
    }
}

module.exports = { getMovieData };
