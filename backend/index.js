const express = require('express');
const fetch=require('node-fetch')
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '41b43d8606mshe14e6858b901648p13cc21jsne9640a861c9c',
      'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
    }
  };

const weatherApiUrl = 'https://open-weather13.p.rapidapi.com/city/';

app.post('/getWeather', async (req, res) => {
    try {
        const cities = req.body.cities;

        if (!cities || cities.length === 0) {
            return res.status(400).json({ error: 'Please provide a valid list of cities.' });
        }

        const weatherResults = await Promise.all(
            cities.map(async (city) => {
                try {
                    const response = await fetch(weatherApiUrl+`${city}`, options);
                    const result=await response.json();
                    const temperature = result.main.temp;
                    return { [city]: `${temperature}°C` };
                } catch (error) {
                    return { [city]: 'N/A' }; // If there's an error fetching weather for a city
                }
            })
        );

        const weatherData = weatherResults.reduce((acc, result) => ({ ...acc, ...result }), {});

        res.json({ weather: weatherData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
