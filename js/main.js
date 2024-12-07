(function () {
  getWeatherCurrentLocation();
})();
// Call the function to get the current weather
function getWeatherCurrentLocation() {
  getLocation()
    .then(getCityName)
    .then(getWeatherForThreeDays)
    .then(setCurrentWeather)
    .then(searchOn)
    .catch(showToast);
}
// Input
function searchOn() {
  let search = document.querySelector(".search .search-input");
  search.addEventListener("input", function () {
    if (search.value == "") {
      console.log("empty");
      getWeatherCurrentLocation();
    } else {
      console.log(search.value);
      getWeatherForThreeDays(search.value)
        .then(setCurrentWeather)
        .catch(showToast);
    }
  });
}

// Get Location
function getLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log(position.coords.latitude, position.coords.longitude);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      function (error) {
        reject(error.message);
      }
    );
  });
}

// Get Lang - Long City Name
function getCityName(coords) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://api-bdc.net/data/reverse-geocode?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en&key=bdc_809006a0eaf344ed9d72abc548c36ca7`
    );
    xhr.send();
    xhr.responseType = "json";
    xhr.addEventListener("loadend", function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log(xhr.response.city);
        resolve(xhr.response.city);
      } else {
        reject("Something Went Wrong");
      }
    });
  });
}

// POP Error
function showToast(msg) {
  let toast = document.getElementById("toast");
  let toastMsg = document.querySelector("#toast p");
  toastMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation me-1 text-danger"></i> ${msg}`;
  toast.style.opacity = 1;
  setTimeout(function () {
    toast.style.opacity = 0;
  }, 2500);
}

// Get weather data from API
function getWeatherForThreeDays(city) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      `https://api.weatherapi.com/v1/forecast.json?key=f2a644d1b2a94ea3802161152240712&q=${city}&days=3`
    );

    xhr.send();
    xhr.responseType = "json";
    xhr.addEventListener("loadend", function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve([
          {
            name: xhr.response.location.name,
            temp: xhr.response.current.temp_c,
            icon: xhr.response.current.condition.icon,
            condition: xhr.response.current.condition.text,
            humidity: xhr.response.current.humidity,
            windSpeed: xhr.response.current.wind_kph,
            windDir: xhr.response.current.wind_dir,
          },
          {
            icon: xhr.response.forecast.forecastday[1].day.condition.icon,
            maxTemp: xhr.response.forecast.forecastday[1].day.maxtemp_c,
            minTemp: xhr.response.forecast.forecastday[1].day.mintemp_c,
            condition: xhr.response.forecast.forecastday[1].day.condition.text,
          },
          {
            icon: xhr.response.forecast.forecastday[2].day.condition.icon,
            maxTemp: xhr.response.forecast.forecastday[2].day.maxtemp_c,
            minTemp: xhr.response.forecast.forecastday[2].day.mintemp_c,
            condition: xhr.response.forecast.forecastday[2].day.condition.text,
          },
        ]);
      } else {
        reject("Nothing Match This City");
      }
    });
  });
}

// Display Data
function setCurrentWeather(info) {
  return new Promise(function (resolve) {
    console.log(info);

    //Current
    displayValues("today-forecast", "day-name", `${getDayName(0)}`);
    displayValues(
      "today-forecast",
      "day-num-month",
      `${getDayNumber(0)} ${getMonthName(0)}`
    );
    displayValues("today-forecast", "location", info[0].name);
    displayValues("today-forecast", "degree", `${info[0].temp}<sup>o</sup>C`);
    displayValues("today-forecast", "degree-img", 0, info[0].icon);
    displayValues("today-forecast", "custom", info[0].condition);
    displayValues(
      "today-forecast",
      "umbrella",
      `<i class="fa-solid me-2 fa-umbrella"></i>${info[0].humidity}%`
    );
    displayValues(
      "today-forecast",
      "wind",
      `<i class="fa-solid me-2 fa-wind"></i>${info[0].windSpeed}km/h`
    );
    displayValues(
      "today-forecast",
      "compass",
      `<i class="fa-solid me-2 fa-compass"></i>${getDirection(info[0].windDir)}`
    );

    // Tomorrow
    displayValues("tomorrow-forecast", "day-name", `${getDayName(1)}`);
    displayValues("tomorrow-forecast", "degree-img", 0, info[1].icon);
    displayValues(
      "tomorrow-forecast",
      "max-deg",
      `${info[1].maxTemp}<sup>o</sup>C`
    );
    displayValues(
      "tomorrow-forecast",
      "min-deg",
      `${info[1].minTemp}<sup>o</sup>C`
    );
    displayValues("tomorrow-forecast", "custom", info[1].condition);

    // AFter-Tomorrow
    displayValues("after-tomorrow-forecast", "day-name", `${getDayName(2)}`);
    displayValues("after-tomorrow-forecast", "degree-img", 0, info[2].icon);
    displayValues(
      "after-tomorrow-forecast",
      "max-deg",
      `${info[2].maxTemp}<sup>o</sup>C`
    );
    displayValues(
      "after-tomorrow-forecast",
      "min-deg",
      `${info[2].minTemp}<sup>o</sup>C`
    );
    displayValues("after-tomorrow-forecast", "custom", info[2].condition);
    resolve();
  });
}

// Global Functions
function getDirection(abbreviation) {
  const abbr = abbreviation.toUpperCase();

  switch (abbr) {
    case "N":
      return "North";
    case "NNE":
      return "North-Northeast";
    case "NE":
      return "Northeast";
    case "ENE":
      return "East-Northeast";
    case "E":
      return "East";
    case "ESE":
      return "East-Southeast";
    case "SE":
      return "South-East";
    case "SSE":
      return "South-Southeast";
    case "S":
      return "South";
    case "SSW":
      return "South-Southwest";
    case "SW":
      return "Southwest";
    case "WSW":
      return "West-Southwest";
    case "W":
      return "West";
    case "WNW":
      return "West-Northwest";
    case "NW":
      return "Northwest";
    case "NNW":
      return "North-Northwest";
    default:
      return "Unknown Direction";
  }
}

function displayValues(parent, child, value, imgUrl) {
  if (!imgUrl) {
    document.querySelector(`.${parent} .${child}`).innerHTML = value;
  } else {
    document.querySelector(`.${parent} .${child}`).setAttribute("src", imgUrl);
    document.querySelector(`.${parent} .${child}`).style.opacity = 1;
  }
}

function getMonthName(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[date.getMonth()];
}

function getDayNumber(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.getDate();
}

function getDayName(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[date.getDay()];
}
