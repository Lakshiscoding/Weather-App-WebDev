const API_KEY = "3ebac56ed327bcabde7e56f98ed62493";

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.getElementById("pageBody").className = savedTheme;
    updateThemeButtons(savedTheme);
}

showHistory();

document.getElementById("cityInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

function changeTheme(theme) {
    document.getElementById("pageBody").className = theme;
    localStorage.setItem("theme", theme);
    updateThemeButtons(theme);
}

function updateThemeButtons(theme) {
    if (theme === "light-theme") {
        document.getElementById("lightBtn").classList.add("active");
        document.getElementById("darkBtn").classList.remove("active");
    } else {
        document.getElementById("darkBtn").classList.add("active");
        document.getElementById("lightBtn").classList.remove("active");
    }
}

function getWeatherIcon(code) {
    if (code >= 200 && code < 300) return "⛈️";
    if (code >= 300 && code < 400) return "🌦️";
    if (code >= 500 && code < 600) return "🌧️";
    if (code >= 600 && code < 700) return "❄️";
    if (code >= 700 && code < 800) return "🌫️";
    if (code === 800) return "☀️";
    if (code === 801) return "🌤️";
    if (code === 802) return "⛅";
    return "🌥️";
}

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const resultBox = document.getElementById("result-box");

    if (city === "") {
        resultBox.innerHTML = '<p class="error-msg">Please enter a city name to search.</p>';
        return;
    }

    resultBox.innerHTML = '<p class="state-message loading">Fetching weather data</p>';

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&appid=" + API_KEY + "&units=metric";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            saveToHistory(city);

            const icon = getWeatherIcon(data.weather[0].id);
            const temp = Math.round(data.main.temp);
            const feels = Math.round(data.main.feels_like);

            resultBox.innerHTML = `
                <div class="weather-card">
                    <div class="card-top">
                        <div>
                            <div class="city-name">${data.name}, ${data.sys.country}</div>
                            <div class="weather-desc">${data.weather[0].description}</div>
                        </div>
                        <div class="weather-icon">${icon}</div>
                    </div>
                    <div class="temp-block">
                        <span class="temp-main">${temp}</span>
                        <span class="temp-unit">°C</span>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">Feels Like</div>
                            <div class="stat-value">${feels}°C</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Humidity</div>
                            <div class="stat-value">${data.main.humidity}%</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Wind Speed</div>
                            <div class="stat-value">${data.wind.speed} m/s</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">Pressure</div>
                            <div class="stat-value">${data.main.pressure} hPa</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (data.cod === "404") {
            resultBox.innerHTML = '<p class="error-msg">City not found. Please check the spelling and try again.</p>';
        } else {
            resultBox.innerHTML = '<p class="error-msg">Something went wrong. Please try again.</p>';
        }
    } catch (error) {
        resultBox.innerHTML = '<p class="error-msg">Network error. Please check your connection and try again.</p>';
    }
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory"));

    if (history === null) {
        history = [];
    }

    const cityLower = city.toLowerCase();
    const newHistory = [];

    for (let i = 0; i < history.length; i++) {
        if (history[i].toLowerCase() !== cityLower) {
            newHistory.push(history[i]);
        }
    }

    newHistory.push(city);

    if (newHistory.length > 6) {
        newHistory.shift();
    }

    localStorage.setItem("weatherHistory", JSON.stringify(newHistory));
    showHistory();
}

function showHistory() {
    let history = JSON.parse(localStorage.getItem("weatherHistory"));

    if (history === null) {
        history = [];
    }

    const section = document.getElementById("historySection");
    const list = document.getElementById("historyList");

    if (history.length === 0) {
        section.style.display = "none";
        return;
    }

    section.style.display = "";
    list.innerHTML = "";

    for (let i = history.length - 1; i >= 0; i--) {
        const city = history[i];
        const chip = document.createElement("button");
        chip.className = "chip";
        chip.textContent = city;
        chip.setAttribute("aria-label", "Search weather for " + city);
        chip.onclick = function() {
            document.getElementById("cityInput").value = this.textContent;
            getWeather();
        };
        list.appendChild(chip);
    }
}

function clearHistory() {
    localStorage.removeItem("weatherHistory");
    showHistory();
}
