document.addEventListener('DOMContentLoaded', function () {
    const getForecastButton = document.getElementById('getForecast');
    getForecastButton.addEventListener('click', function () {
      const city = document.getElementById('city').value;
      const YOUR_API_KEY = '0de892b15bdb456fa4ff21da889c960d'
  
      if (city) {
        // Geocode the city to get the coordinates
        const geocodingUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=0de892b15bdb456fa4ff21da889c960d`;
  
        fetch(geocodingUrl)
          .then(response => response.json())
          .then(data => {
            // Extract the coordinates from the geocoding response
            const latitude = data.results[0].geometry.lat;
            const longitude = data.results[0].geometry.lng;
  
            // Use the coordinates to get the forecast
            const weatherUrl = `https://api.weather.gov/points/${latitude},${longitude}`;
  
            fetch(weatherUrl)
              .then(response => response.json())
              .then(data => {
                const forecastUrl = data.properties.forecast;
  
                return fetch(forecastUrl);
              })
              .then(forecastResponse => forecastResponse.json())
              .then(forecastData => {
                const periods = forecastData.properties.periods;
  
                let closestPeriod = null;
                let minTimeDiff = Number.MAX_SAFE_INTEGER;
  
                const inputTime = new Date();
  
                for (const period of periods) {
                  const startTime = new Date(period.startTime);
                  const timeDiff = Math.abs(startTime - inputTime);
  
                  if (timeDiff < minTimeDiff) {
                    minTimeDiff = timeDiff;
                    closestPeriod = period;
                  }
                }
  
                const forecastContainer = document.getElementById('forecastContainer');
  
                if (closestPeriod !== null) {
                  forecastContainer.innerHTML = `
                    <h2>Closest Period:</h2>
                    <p>Start time: ${closestPeriod.startTime}</p>
                    <p>End time: ${closestPeriod.endTime}</p>
                    <p>Temperature: ${closestPeriod.temperature} ${closestPeriod.temperatureUnit}</p>
                    <p>Short forecast: ${closestPeriod.shortForecast}</p>
                    <p>Detailed forecast: ${closestPeriod.detailedForecast}</p>
                  `;
                } else {
                  forecastContainer.innerHTML = '<p>No forecast period found.</p>';
                }
              })
              .catch(error => {
                console.log('Failed to retrieve the forecast. Error:', error);
              });
          })
          .catch(error => {
            console.log('Failed to geocode the city. Error:', error);
          });
      } else {
        alert('Please enter a city.');
      }
    });
  });
  