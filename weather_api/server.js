const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import cors

const app = express();
const PORT = 5003;
const API_KEY = '36c267d8e2f79372f3f0e78b82bbffc3'; // Replace with your API key

app.use(cors());  // Enable CORS for all routes

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  const place = req.query.place;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${API_KEY}&units=metric`);
    const weatherData = {
      temperature: response.data.main.temp,
      condition: response.data.weather[0].description,
      humidity: response.data.main.humidity,
    };
    res.json(weatherData);
  } catch (error) {
    res.status(404).json({ error: 'Weather data not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
