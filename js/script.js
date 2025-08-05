const apiKey = "d7556fae1b449dcf2085a688fcfa3783";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weatherIcon");

const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const humidityElement = document.querySelector(".humidity");
const windElement = document.querySelector(".wind");
const errorElement = document.querySelector(".error");
const weatherElement = document.querySelector(".weather");

const icons = {
    Clouds: "images/clouds.png",
    Rain: "images/rain.png",
    Mist: "images/mist.png",
    Drizzle: "images/drizzle.png",
    Snow: "images/snow.png",
    Clear: "images/clear.png"
}

function showError(message){
    errorElement.textContent = message;
    errorElement.style.display = "block";
    weatherElement.style.display = "none";
}

function showWeather(){
    errorElement.style.display = "none";
    weatherElement.style.display = "block";
}

async function checkWeather(city) {

    if(city.trim() === ""){
        showError("Please enter a city name!")
        return;
    }

    try{
        const response = await fetch(`${baseUrl}&q=${city}&appid=${apiKey}`);

        if(response.status === 404){
            showError("City not found please try again");
            return;
        }

        const data = await response.json();
        
        if(!data.weather || !data.weather[0]){
            showError("weather data unavailable!");
            return;
        }

        cityElement.textContent = data.name;
        tempElement.textContent = Math.round(data.main.temp) + "°c";
        humidityElement.textContent = data.main.humidity + "%";
        windElement.textContent = data.wind.speed + " km/hr";

        weatherIcon.src = icons[data.weather[0].main] || "images/default.png";
        
        showWeather();
    }
    catch(error){
        console.error("Error fetching data", error);
        showError("Network error. Please try again later")
    }
}

searchBtn.addEventListener("click", ()=> {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keydown", event=> {
    if(event.key === "Enter"){
        event.preventDefault();
        checkWeather(searchBox.value);
    }
});
