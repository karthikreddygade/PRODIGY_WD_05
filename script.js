document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '57cdbc54426192009847f613112ecc9b';
    const weatherInfo = document.getElementById('weather-info');
    const searchBtn = document.getElementById('search-btn');
    const locationInput = document.getElementById('location-input');

    const getWeatherByLocation = (location) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&app id=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Weather data not available for this location.');
                }
                return response.json();
            })
            .then(data => displayWeather(data))
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherInfo.innerHTML = `<p class="weather-data">Error: ${error.message}</p>`;
            });
    };

    const displayWeather = (data) => {


        const { name, main, weather, wind } = data;
        weatherInfo.innerHTML = `
            <p class="weather-data"><strong>Location:</strong> ${name}</p>
            <p class="weather-data"><strong>Temperature:</strong> ${main.temp}°C</p>
            <p class="weather-data"><strong>Weather:</strong> ${weather[0].description}</p>
            <p class="weather-data"><strong>Humidity:</strong> ${main.humidity}%</p>
            <p class="weather-data"><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        `;
    };

    searchBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            getWeatherByLocation(location);
        } else {
            weatherInfo.innerHTML = `<p class="weather-data">Please enter a location.</p>`;
        }
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
                .then(response => {

                    return response.json();
                })
                .then(data => displayWeather(data))
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    weatherInfo.innerHTML = `<p class="weather-data">Error: ${error.message}</p>`;
                });
        }, error => {
            console.error('Error getting location:', error);
            weatherInfo.innerHTML = `<p class="weather-data">Error: Unable to retrieve your location.</p>`;
        });
    } else {
        weatherInfo.innerHTML = `<p class="weather-data">Geolocation is not supported by this browser.</p>`;
    }
});
