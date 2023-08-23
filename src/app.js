const dotenv = require('dotenv');
const exporess = require('express');
const cors = require('cors');
const weatherData = require('../data/weather.json');

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();
app.us(cors());

class Forecast {
    constructor(data, description) {
        this.date = date;
        this.description = description;
    }
}

function handleAPIError(res, message) {
    res.status(500).json({ error: message });
}

app.get('/weather', (req, res) => {
    const cityData = weatherData.find(city => {
        return (
            city.lat === parseFloat(lat) &&
            city.lon === parseFloat(lon) &&
            city.searchQuery === searchQuery
        );
    });

    if (!cityData) {
        return res.status(404).json({ error: 'City data not found.'});
    }

    const forecasts = cityData.forecast.map(item => new Forecast(item.date, item.description));
    res.json(forecasts);
});

app.get('*', (req, res) => {
    handleAPIError(res, 'Something went wrong.');
});

app.listen(PORT, () => {
    console.log('App is listening on port ' + PORT);
});