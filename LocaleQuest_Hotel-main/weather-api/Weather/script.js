document.getElementById('weatherForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const destination = document.getElementById('destination').value;
    const weatherInfo = document.getElementById('weatherInfo');
    const errorMessage = document.getElementById('error');
    
    weatherInfo.innerHTML = '';  // Clear previous weather data
    errorMessage.innerHTML = ''; // Clear previous error messages
    
    try {
      const response = await fetch(`http://localhost:5009/weather?place=${destination}`);
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const weather = await response.json();
      weatherInfo.innerHTML = `
        <h3>Weather in ${destination}</h3>
        <p>Temperature: ${weather.temperature}°C</p>
        <p>Condition: ${weather.condition}</p>
        <p>Humidity: ${weather.humidity}%</p>
      `;
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
  