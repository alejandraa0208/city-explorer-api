const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_KEY;

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

function retrieveWeatherData(response) {
    return response.data.slice(0, 5).map(item => {
        return new Forecast(item.valid_date, item.weather.description);
    });
}

async function getWeatherData(lat, lon) {
    try {
        const apiUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lon=${lon}&lat=${lat}`;
        const weatherResponse = await axios.get(apiUrl);
        const weatherData = retrieveWeatherData(weatherResponse.data);

        return weatherData;
    } catch (error) {
        throw new Error('Error fetching weather data from API');
    }
}

module.exports = { getWeatherData };
