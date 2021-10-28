// Use git-it-done for reference
var cityInput = document.querySelector("#cityInput");
var apiKey = "&appid=0cab3455fdc5081541be5d657005bb3b";

// Location based current city

// Get Today's Weather Data
var todayInfo = function (city) {
  var currentDataURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    apiKey +
    "&units=imperial";
  fetch(currentDataURL)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
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

// Display Today's Info
var displayToday = function (data) {
  $("#city-temp").text(data.main.temp);
  $("#city-wind").text(data.wind.speed);
  $("#city-humid").text(data.main.humidity);
};

// Get 5 Day Forecast
var fiveDayInfo = function (city) {
  var forecastDataURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=0cab3455fdc5081541be5d657005bb3b";
  fetch(forecastDataURL).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);
      });
    } else {
      alert("Error:" + response.statusText);
    }
  });
};

// Display Forecast Info
var displayForecast = function () {};

// Current Date is displayed - change to current cities date if time zone doesnt match
$("#current-date").text(moment().format("(MM/DD/YYYY)"));

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
    todayInfo(submittedCity);
    fiveDayInfo(submittedCity);
    historyLi.append(historyBtn);
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
  todayInfo(submittedCity);
  fiveDayInfo(submittedCity);
});

/* <button
type="button"
class="btn btn-secondary row col-12 m-2 text-center my-3"
>
City
</button> */
