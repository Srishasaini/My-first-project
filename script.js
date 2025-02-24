document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const locationInput = document.getElementById("location-input");
  const currentTemp = document.getElementById("current-temp");
  const weatherDescription = document.getElementById("weather-description");
  const humidity = document.getElementById("humidity");
  const windSpeed = document.getElementById("wind-speed");
  const feels = document.getElementById("Feels");
  const pressure = document.getElementById("pressure");
  const visibility = document.getElementById("visibility");
  const weatherImg = document.querySelector(".weather-image");
  const forecastContainer = document.querySelector(".forecast-cards");
  const main1 = document.querySelector(".main-1");
  const main2 = document.querySelector(".main-2");


  const API_KEY = "3534d54cd11fa14b73e8d2e2875775c2"; // Replace with your actual API key

  // Event listener for search button
  searchBtn.addEventListener("click", () => {
    main1.style.display = "none"; // Hide main-1
    main2.style.display = "block"; // Show main-2

    // After 15 seconds, switch back
    setTimeout(function () {
        main1.style.display = "block"; // Show main-1
        main2.style.display = "none"; // Hide main-2
    }, 15000); // 15000ms = 15 seconds
    
      const location = locationInput.value.trim();
      if (!location) {
          alert("Please enter a location.");
          return;
      }
      fetchWeatherData(location);
  });

  // Function to update date and time in real-time
  function updateDateTime() {
      const now = new Date();
     // const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      const options = { weekday: "long", month: "long", day: "numeric" };  
      const date = now.toLocaleDateString(undefined, options);
      //const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true });
      document.getElementById("date-time").textContent = `${date}, ${time}`;
  }

  setInterval(updateDateTime, 1000);
  updateDateTime(); // Initial call

  // Function to fetch weather data
  async function fetchWeatherData(location) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`;
      
      try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
              throw new Error(`Weather data not found for "${location}".`);
          }
          const data = await response.json();
          console.log("Weather Data:", data);
         
          displayWeatherData(data);
          updateWeatherCards(data);
      } catch (error) {
          console.error("Error fetching weather data:", error);
          alert("Failed to retrieve weather data. Please try again.");
      }
  }

  // Function to display current weather data
  function displayWeatherData(data) {
    // verify
      const weather = data.list[0];
      document.getElementById("data_name").textContent = `${data.city.name}`;
      currentTemp.textContent = `${weather.main.temp.toFixed(1)}°C`;
      weatherDescription.textContent = weather.weather[0].description;
      humidity.textContent = `Humidity: ${weather.main.humidity}%`;
      windSpeed.textContent = `Wind: ${weather.wind.speed.toFixed(1)} km/h`;
      feels.textContent = `Feels like: ${weather.main.feels_like.toFixed(1)}°C`;
      pressure.textContent = `Pressure: ${weather.main.pressure} mb`;
      visibility.textContent = `Visibility: ${(weather.visibility / 1000).toFixed(1)} km`;

      // Update weather image based on conditions
      const weatherCondition = weather.weather[0].main;
      const weatherIcons = {
          "Clouds": "cloud.png",
          "Clear": "sunny.png",
          "Rain": "rain.png",
          "Mist": "mist.png",
          "Snow": "snow.png"
      };
      
      weatherImg.src = `/images/${weatherIcons[weatherCondition] || "default.png"}`;
      weatherImg.alt = weatherCondition;
  }

  // Function to update 5-day forecast cards
  function updateWeatherCards(data) {
      forecastContainer.innerHTML = ""; // Clear previous forecast
      
      const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

      dailyForecasts.forEach(forecast => {
          const date = new Date(forecast.dt * 1000);
          const day = date.toLocaleDateString(undefined, { weekday: "short" });
          const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
          const temp = `${forecast.main.temp.toFixed(1)}°C`;
          const dtTxtValues = forecast.dt_txt.split(" ")[0];
         
      console.log(dtTxtValues);
          const card = document.createElement("div");
          card.classList.add("forecast-card");
          card.innerHTML = `
              <p>${day}</p>
              <p>${dtTxtValues}</p>
              <img src="${iconUrl}" alt="Weather Icon">
              <p>${temp}</p>
          `;

          forecastContainer.appendChild(card);
      });
  }

  // Search by location
  const locationBtn = document.getElementById("get-location-btn");
//const API_KEY = "3534d54cd11fa14b73e8d2e2875775c2"; // Replace with your OpenWeather API key

  locationBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              async (position) => {
                  const lat = position.coords.latitude;
                  const lon = position.coords.longitude;
                  console.log(`Latitude: ${lat}, Longitude: ${lon}`);
                  fetchWeatherByCoordinates(lat, lon);
              },
              (error) => {
                  console.error("Error getting location:", error);
                  alert("Unable to retrieve your location. Please allow location access.");
              }
          );
      } else {
          alert("Geolocation is not supported by your browser.");
      }
  });

  async function fetchWeatherByCoordinates(lat, lon) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forcast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      try {
          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error("Failed to fetch weather data.");

          const data = await response.json();
          console.log("Weather Data:", data);
           // Update Weather UI
           document.getElementById("current-temp").innerText = `${data.main.temp}°C`;
           document.getElementById("weather-description").innerText = data.weather[0].description;
           document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
           document.getElementById("wind-speed").innerText = `Wind: ${data.wind.speed} km/h`;
           document.getElementById("Feels").innerText = `Feels like: ${data.main.feels_like}°C`;
           document.getElementById("pressure").innerText = `Pressure: ${data.main.pressure} hPa`;
           document.getElementById("visibility").innerText = `Visibility: ${data.visibility / 1000} km`;

           // Update weather icon
           const weatherIcon = document.querySelector(".weather-image");
           const iconCode = data.weather[0].icon;
           weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
          
          alert(`Weather in ${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`);
      } catch (error) {
          console.error("Error fetching weather:", error);
      }
  }
});


//corousol
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("carousel");
    let index = 0;

    function nextSlide() {
        index = (index + 1) % carousel.children.length;
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    setInterval(nextSlide, 3000); // Change slide every 3 seconds
});
