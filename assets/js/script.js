var apiKey = "ad3c8c81e305ed1e500630813b32f2cd";
var historyArr = [];
var citySearch = document.getElementById("citySearch");
var searchBox = document.getElementById("searchBox");
var historyEl = document.getElementById("history");
var currentWeather = document.getElementById("currentWeatherContent");
var forecast = document.getElementById("forecast").children;

function init() {
    loadHistory();
}

function weatherAPIcall(lat, lon) {
    console.log(lat, lon);
    var currentQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(currentQuery)
        .then(function (response) {
            if (!response.ok) {
                alert(`Current Weather Error ${response.status}`);
                return;
            }
            return response.json();
        })
        .then(function (data) {
            writeWeather(currentWeather, data, true);
        });

    var forecastQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    fetch(forecastQuery)
        .then(function (response) {
            if (!response.ok) {
                alert(`Forecast Error ${response.status}`);
                return;
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var index = 0;
            for (var i = 4; i < data.list.length; i += 8) {
                writeWeather(forecast[index], data.list[i], false);
                index++;
            }
        });

}

function geoAPIcall(city) {
    var query = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(query)
        .then(function (response) {
            if (!response.ok) {
                alert("City not found. Try again");
                return;
            }
            return response.json();
        })
        .then(function (data) {
            if (data.length == 0) {
                alert("City not found. Try again");
                return;
            }
            weatherAPIcall(data[0].lat, data[0].lon);
        })

}

function writeWeather(element, result, loc) {
    if (loc) {
        element.children[0].textContent = `${result.name} ${"date"}`;
    }
    else {
        element.children[0].textContent = "(00/00/0000)";
    }
    element.children[1].setAttribute("src", `https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`)
    element.children[2].textContent = `Temp: ${result.main.temp}°F`;
    element.children[3].textContent = `Wind: ${result.wind.speed}MPH`;
    element.children[4].textContent = `Humidity: ${result.main.humidity}%`;
}

function saveHistory() {
    localStorage.setItem("cityHistory", JSON.stringify(historyArr));
}

function loadHistory() {
    historyArr = JSON.parse(localStorage.getItem("cityHistory"));
    if (historyArr === null) {
        historyArr = [];
    }
    for (var i = 0; i < historyArr.length; i++) {
        addHistory(historyArr[i]);
    }
}

function addHistory(city) {
    var historyItem = document.createElement("li");
    historyItem.className = "card text-center bg-secondary list-group-item";
    historyItem.textContent = city;
    historyEl.append(historyItem);
}

init();

citySearch.addEventListener("submit", function (event) {
    event.preventDefault();
    if (searchBox.value == "") {
        return;
    }
    geoAPIcall(event.target.textContent);
    if (!historyArr.includes(searchBox.value)) {
        historyArr.push(searchBox.value);
        addHistory(searchBox.value);
        saveHistory();
    }
});

historyEl.addEventListener("click", function (event) {
    searchBox.value = event.target.textContent;
    geoAPIcall(event.target.textContent);
});