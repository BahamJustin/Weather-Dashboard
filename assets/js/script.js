// Use git-it-done for reference
var cityInput = document.querySelector("#cityInput");
var apiKey = "&appid=0cab3455fdc5081541be5d657005bb3b";

// Current Date is displayed - change to current cities date if time zone doesnt match
$("#current-date").text(moment().format("(MM/DD/YYYY)"));

// Location based current city

// Get Today's Weather Data
var cityCurrent = function (cityLat, cityLon) {
  var currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    cityLat +
    "&lon=" +
    cityLon +
    "&exclude=minutely&exclude=hourly&exclude=alerts" +
    "&units=imperial" +
    apiKey;
  fetch(currentWeatherURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data.current);
          displayToday(data);
        });
      } else {
        alert("Error:" + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
};

// Get 5 Day Forecast
var fiveDay = function (cityLat, cityLon) {
  var forecastDataURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    cityLat +
    "&lon=" +
    cityLon +
    "&exclude=minutely&exclude=hourly&exclude=alerts" +
    "&units=imperial" +
    apiKey;
  fetch(forecastDataURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data.daily);
        displayForecast(data.daily);
      });
    } else {
      alert("Error:" + response.statusText);
    }
  });
};

// Get City Lat/Long
var callCity = function (city) {
  var callCityURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    apiKey +
    "&units=imperial";
  fetch(callCityURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var cityLat = data.coord.lat;
          var cityLon = data.coord.lon;
          cityCurrent(cityLat, cityLon);
          fiveDay(cityLat, cityLon);
        });
      } else {
        alert("Error:" + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
};

// Display Today's Info
var displayToday = function (data) {
  $("#city-temp").text(data.current.temp + " °F");
  $("#city-wind").text(data.current.wind_speed + " MPH");
  $("#city-humid").text(data.current.humidity + "%");
  var iconcode = data.current.weather[0].icon;
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  $("#wicon").attr("src", iconurl);
  $("#city-uv").text(data.current.uvi);
};

// Display Forecast Info
var displayForecast = function (data) {
  for (var i = 0; i < 5; i++) {
    // Daily Date
    // Daily Icon
    // Daily Temp
    $("#dayOneTemp").text(data[0].temp.min + "/" + data[0].temp.max);
    $("#dayTwoTemp").text(data[1].temp.min + "/" + data[1].temp.max);
    $("#dayThreeTemp").text(data[2].temp.min + "/" + data[2].temp.max);
    $("#dayFourTemp").text(data[3].temp.min + "/" + data[3].temp.max);
    $("#dayFiveTemp").text(data[4].temp.min + "/" + data[4].temp.max);
    // Daily Wind Speed
    // Daily Humidity
    var maxTemp = data[i].temp.max;
    var windSpeed = data[i].wind_speed;
    var humidity = data[i].humidity;

    console.log(maxTemp, windSpeed, humidity);
  }
};

// Submit a City to view information
$("#submit").on("click", function (event) {
  // prevent refresh
  event.preventDefault();

  // capture submitted city input
  var submittedCity = cityInput.value.trim();
  $("#current-city").text(submittedCity);

  // Add submitted city to History
  var historyLi = $("#history-list");
  var historyBtn = $("<button>")
    .addClass("btn btn-secondary row col-12 m-2 text-center my-3")
    .text(submittedCity);

  // check for valid city
  if (submittedCity) {
    callCity(submittedCity);
    // fiveDayInfo(submittedCity);
    // historyLi.append(historyBtn);
  } else {
    alert("Please enter a valid city");
  }

  // Limit History List
  // Prevent duplicates
});

// Clicking city in search history displays the info for that city again
$("#history-list").on("click", "button", function () {
  var submittedCity = $(this).text();
  console.log(submittedCity);
  $("#current-city").text(submittedCity);
  // todayInfo(submittedCity);
  // fiveDayInfo(submittedCity);
});

/* <button
type="button"
class="btn btn-secondary row col-12 m-2 text-center my-3"
>
City
</button> */
