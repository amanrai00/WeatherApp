// Your API Key from OpenWeatherMap (Add your real key here)
const apiKey = "";

// Base URL for fetching weather data in metric (Celsius)
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";

// Selecting elements from the DOM
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weatherIcon");

const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");
const errorElement = document.querySelector(".error");
const weatherElement = document.querySelector(".weather");

// Weather condition icons mapped by condition type
const icons = {
    Clouds: "images/clouds.png",
    Rain: "images/rain.png",
    Mist: "images/mist.png",
    Drizzle: "images/drizzle.png",
    Snow: "images/snow.png",
    Clear: "images/clear.png"
};

// Display an error message to the user
function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    weatherElement.style.display = "none";
}

// Show weather section and hide error
function showWeather() {
    errorElement.style.display = "none";
    weatherElement.style.display = "block";
}

// Main function: Fetch weather data for a given city
async function checkWeather(city) {

    // Prevent empty input
    if(city.trim() === "") {
        showError("Please enter a city name!");
        return;
    }

    try {
        // Fetching weather data from API
        const response = await fetch(`${baseUrl}&q=${city}&appid=${apiKey}`);

        // If city is not found (404)
        if(response.status === 404) {
            showError("City not found. Please try again.");
            return;
        }

        // Parse JSON data
        const data = await response.json();

        // Handle missing weather data
        if(!data.weather || !data.weather[0]) {
            showError("Weather data unavailable!");
            return;
        }

        // Update DOM with weather data
        cityElement.textContent = data.name;
        tempElement.textContent = Math.round(data.main.temp) + "°c";
        humidityElement.textContent = data.main.humidity + "%";
        windElement.textContent = data.wind.speed + " km/hr";

        // Set weather icon based on condition
        weatherIcon.src = icons[data.weather[0].main] || "images/default.png";

        showWeather();
    }
    catch(error) {
        console.error("Error fetching data", error);
        showError("Network error. Please try again later.");
    }
}

// Event: Click on search button
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Event: Press Enter inside the input box
searchBox.addEventListener("keydown", event => {
    if(event.key === "Enter") {
        event.preventDefault(); // Prevent default form submit
        checkWeather(searchBox.value);
    }
});
