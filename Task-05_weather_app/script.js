// Wrap entire script content inside this listener
document.addEventListener('DOMContentLoaded', () => {

    const API_KEY = '0e814a37b02ba0f5329ed1875aaf6860'; // API Key
    const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

    // Get references to HTML elements
    const locationInput = document.getElementById('locationInput');
    const searchBtn = document.getElementById('searchBtn');
    const currentLocationBtn = document.getElementById('currentLocationBtn');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const errorMessage = document.getElementById('errorMessage');

    // Function to display error messages
    function displayError(message) {
        errorMessage.textContent = message;
        weatherDisplay.innerHTML = ''; // Clear previous weather data
        hideLoading(); // Hide loading indicator if an error occurs
    }

    // Function to clear error messages
    function clearError() {
        errorMessage.textContent = '';
    }

    // Function to show loading indicator
    function showLoading() {
        weatherDisplay.innerHTML = '<p class="loading-message">Loading weather data...</p>';
        clearError(); // Clear any previous errors when loading starts
    }

    // Function to hide loading indicator
    function hideLoading() {
        // This function will clear the loading message once the data is displayed
        // or an error occurs.
        // displayWeather or displayError will overwrite weatherDisplay.innerHTML.
    }


    // Function to display weather data
    function displayWeather(data) {
        hideLoading(); // Hide loading indicator as data is ready
        clearError();

        // Check for API-specific error codes (e.g., 404 for not found)
        if (data.cod && data.cod === '404') {
            displayError('Location not found. Please check the city name and try again.');
            return;
        }
        if (data.cod && data.cod !== 200) { // Catch other API errors
            displayError(`API Error: ${data.message || 'Something went wrong with the weather API.'}`);
            return;
        }
        if (!data || !data.main || !data.weather || !data.wind) {
            displayError('Invalid weather data received. Please try again.');
            return;
        }


        const { name, main, weather, wind } = data;
        const temperatureCelsius = (main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
        const feelsLikeCelsius = (main.feels_like - 273.15).toFixed(1);
        const description = weather[0].description;
        const iconCode = weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherDisplay.innerHTML = `
            <h2>Weather in ${name}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <p><strong>Temperature:</strong> ${temperatureCelsius}°C (Feels like: ${feelsLikeCelsius}°C)</p>
            <p><strong>Condition:</strong> ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <p><strong>Humidity:</strong> ${main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
            <p><strong>Pressure:</strong> ${main.pressure} hPa</p>
        `;
    }

    // Function to fetch weather data by city name
    async function fetchWeatherByCity(city) {
        if (!city) {
            displayError('Please enter a city name.');
            return;
        }
        showLoading(); // Show loading indicator
        const url = `${API_BASE_URL}?q=${city}&appid=${API_KEY}`;
        try {
            const response = await fetch(url);
            // Check for HTTP errors (e.g., 401 Unauthorized for bad API key)
            if (!response.ok) {
                const errorData = await response.json(); // Try to get error message from API
                if (response.status === 401) {
                    displayError('Authentication failed. Please check your API key.');
                } else {
                    displayError(`HTTP error! Status: ${response.status} - ${errorData.message || 'Could not fetch data.'}`);
                }
                hideLoading();
                return;
            }
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            displayError('Network error or invalid response. Please check your internet connection.');
            hideLoading(); // Hide loading on network error
        } finally {
            locationInput.value = ''; // Optionally clear input after search
        }
    }

    // Function to fetch weather data by geolocation coordinates
    async function fetchWeatherByCoords(latitude, longitude) {
        showLoading(); // Show loading indicator
        const url = `${API_BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    displayError('Authentication failed. Please check your API key.');
                } else {
                        displayError(`HTTP error! Status: ${response.status} - ${errorData.message || 'Could not fetch data.'}`);
                }
                hideLoading();
                return;
            }
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            displayError('Network error or invalid response for your location. Please try again.');
            hideLoading(); // Hide loading on network error
        }
    }

    // Event Listener for Search Button
    // Check if element exists before adding listener, though moving script is better
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const city = locationInput.value.trim();
            fetchWeatherByCity(city);
        });
    }


    // Allow searching by pressing Enter in the input field
    // Check if element exists before adding listener
    if (locationInput) {
        locationInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchBtn.click(); // Simulate a click on the search button
            }
        });
    }

    // Event Listener for 'Use My Current Location' Button
    // Check if element exists before adding listener
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', () => {
            clearError(); // Clear any existing errors when attempting geolocation
            showLoading(); // Show loading message while getting geolocation

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherByCoords(latitude, longitude);
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        hideLoading(); // Hide loading if geolocation fails
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                displayError("Geolocation permission denied. Please allow location access in your browser settings to use this feature.");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                displayError("Location information is unavailable. Try typing a city name instead.");
                                break;
                            case error.TIMEOUT:
                                displayError("The request to get user location timed out. Please try again.");
                                break;
                            default:
                                displayError("An unknown error occurred while getting your location.");
                                break;
                        }
                    },
                    {
                        enableHighAccuracy: true, // Request a more accurate position
                        timeout: 10000,          // Maximum time (ms) to wait for a position
                        maximumAge: 0            // Don't use a cached position
                    }
                );
            } else {
                displayError('Geolocation is not supported by your browser. Please enter a city name manually.');
                hideLoading(); // Hide loading if browser doesn't support
            }
        });
    }

    // Initial message on load
    // Check if element exists before modifying
    if (weatherDisplay) {
        weatherDisplay.innerHTML = '<p>Enter a city or use your current location to get weather updates.</p>';
    }

}); // End of DOMContentLoaded listener

