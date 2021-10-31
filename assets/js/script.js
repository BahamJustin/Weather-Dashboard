var cityInput = document.querySelector("#cityInput");
var apiKey = "&appid=0cab3455fdc5081541be5d657005bb3b";
var listLimit = 0;
var alreadyAdded = [];

// Current Date is displayed - change to current cities date if time zone doesnt match
$("#current-date").text(moment().format("MM/DD/YYYY"));

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
          console.log(data);
          var cityName = data.name;
          $("#current-city").text(cityName);
          var cityLat = data.coord.lat;
          var cityLon = data.coord.lon;
          cityCurrent(cityLat, cityLon);
          fiveDay(cityLat, cityLon);
        });
      } else if (!response.ok) {
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

  // UV Index Color Code
  var UVIndex = data.current.uvi;
  var indexEl = $("#city-uv");
  $("#city-uv").text(UVIndex);
  console.log(UVIndex);
  if (UVIndex <= 2) {
    indexEl.addClass("bg-low");
  } else if (UVIndex <= 5 && UVIndex <= 2) {
    indexEl.addClass("bg-medium");
  } else if (UVIndex <= 7 && UVIndex <= 7) {
    indexEl.addClass("bg-high");
  } else if (UVIndex <= 10 && UVIndex <= 7) {
    indexEl.addClass("bg-veryhigh");
  } else if (UVIndex > 11 && UVIndex > 10) {
    indexEl.addClass("bg-extreme");
  }
};

// Display Forecast Info
var displayForecast = function (data) {
  for (var i = 0; i < 5; i++) {
    // Daily Date
    $("#dayOneDate").text(moment().add(1, "days").format("MM/DD/YYYY"));
    $("#dayTwoDate").text(moment().add(2, "days").format("MM/DD/YYYY"));
    $("#dayThreeDate").text(moment().add(3, "days").format("MM/DD/YYYY"));
    $("#dayFourDate").text(moment().add(4, "days").format("MM/DD/YYYY"));
    $("#dayFiveDate").text(moment().add(5, "days").format("MM/DD/YYYY"));

    // Daily Icon
    $("#dayOneIcon").attr(
      "src",
      "http://openweathermap.org/img/w/" + data[0].weather[0].icon + ".png"
    );
    $("#dayTwoIcon").attr(
      "src",
      "http://openweathermap.org/img/w/" + data[1].weather[0].icon + ".png"
    );
    $("#dayThreeIcon").attr(
      "src",
      "http://openweathermap.org/img/w/" + data[2].weather[0].icon + ".png"
    );
    $("#dayFourIcon").attr(
      "src",
      "http://openweathermap.org/img/w/" + data[3].weather[0].icon + ".png"
    );
    $("#dayFiveIcon").attr(
      "src",
      "http://openweathermap.org/img/w/" + data[4].weather[0].icon + ".png"
    );

    // Daily Temp
    $("#dayOneTemp").text(data[0].temp.min + "/" + data[0].temp.max);
    $("#dayTwoTemp").text(data[1].temp.min + "/" + data[1].temp.max);
    $("#dayThreeTemp").text(data[2].temp.min + "/" + data[2].temp.max);
    $("#dayFourTemp").text(data[3].temp.min + "/" + data[3].temp.max);
    $("#dayFiveTemp").text(data[4].temp.min + "/" + data[4].temp.max);

    // Daily Wind Speed
    $("#dayOneWind").text(data[0].wind_speed + " MPH");
    $("#dayTwoWind").text(data[1].wind_speed + " MPH");
    $("#dayThreeWind").text(data[2].wind_speed + " MPH");
    $("#dayFourWind").text(data[3].wind_speed + " MPH");
    $("#dayFiveWind").text(data[4].wind_speed + " MPH");

    // Daily Humidity
    $("#dayOneHumid").text(data[0].humidity + "%");
    $("#dayTwoHumid").text(data[1].humidity + "%");
    $("#dayThreeHumid").text(data[2].humidity + "%");
    $("#dayFourHumid").text(data[3].humidity + "%");
    $("#dayFiveHumid").text(data[4].humidity + "%");

    var minTemp = data[i].temp.min;
    var maxTemp = data[i].temp.max;
    var windSpeed = data[i].wind_speed;
    var humidity = data[i].humidity;
  }
};

// Submit a City to view information
$("#submit").on("click", function (event) {
  // prevent refresh
  event.preventDefault();

  // capture submitted city input
  var submittedCity = cityInput.value.trim();

  // Add submitted city to History
  var historyLi = $("#history-list");
  var historyBtn = $("<button>")
    .addClass("btn btn-history row col-12 m-2 text-center")
    .text(submittedCity);

  // check for valid city
  if (submittedCity) {
    callCity(submittedCity);
  } else {
    alert("Please enter a valid city");
  }

  // Limit History List & Prevent Duplicates
  if (
    submittedCity &&
    listLimit <= 10 &&
    alreadyAdded.includes(submittedCity) === false
  ) {
    listLimit++;
    console.log(listLimit);
    historyLi.append(historyBtn);
    alreadyAdded.push(submittedCity);
  }

  // Clear input
  cityInput.value = "";
});

// Clicking city in search history displays the info for that city again
$("#history-list").on("click", "button", function () {
  var submittedCity = $(this).text();
  console.log(submittedCity);
  $("#current-city").text(submittedCity);
  callCity(submittedCity);
});
