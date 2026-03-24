var currentTheme = localStorage.getItem("themeColor");
if (currentTheme) {
    document.getElementById("pageBody").className = currentTheme;
}

function changeTheme(color) {
    document.getElementById("pageBody").className = color;
    localStorage.setItem("themeColor", color);
}

function getWeather() {
    var city = document.getElementById("cityInput").value;
    if (city == "") {
        alert("Please type a city!");
        return;
    }

    saveToHistory(city);

    var apiKey = "3ebac56ed327bcabde7e56f98ed62493"; 
    
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
    
    var box = document.getElementById("result-box");
    box.innerHTML = "Fetching data...";

    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.name) {
                box.innerHTML = "<strong>" + data.name + "</strong><br>" +
                                "🌡️ Temp: " + data.main.temp + "°C<br>" +
                                "💧 Humidity: " + data.main.humidity + "%<br>" + 
                                "☁️ Status: " + data.weather[0].description;
            } else {
                box.innerHTML = "City not found!";
            }
        })
        .catch(function(error) {
            box.innerHTML = "Connection Error!";
        });
}

function saveToHistory(city) {
    var oldHistory = localStorage.getItem("myHistory");
    if (oldHistory == null) {
        localStorage.setItem("myHistory", city);
    } else {
        localStorage.setItem("myHistory", oldHistory + "," + city);
    }
    showHistory();
}

function showHistory() {
    var list = document.getElementById("historyList");
    var data = localStorage.getItem("myHistory");
    list.innerHTML = ""; 
    if (data != null) {
        var cities = data.split(",");
        var lastFive = cities.slice(-5).reverse(); 
        for (var i = 0; i < lastFive.length; i++) {
            list.innerHTML += "<li>" + lastFive[i] + "</li>";
        }
    }
}

function clearHistory() {
    localStorage.removeItem("myHistory");
    showHistory();
}

showHistory();
