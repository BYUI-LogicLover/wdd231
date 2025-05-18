// Weather functionality for the Chamber of Commerce website

class WeatherService {
    constructor(lat, lon, apiKey) {
        this.lat = lat;
        this.lon = lon;
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    async fetchData(endpoint) {
        const url = `${this.baseUrl}/${endpoint}?lat=${this.lat}&lon=${this.lon}&units=imperial&appid=${this.apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${endpoint} data`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint} data:`, error);
            return null;
        }
    }

    async getCurrentWeather() {
        return this.fetchData('weather');
    }

    async getForecast() {
        return this.fetchData('forecast');
    }
}

class WeatherUI {
    static createWeatherIcon(iconCode, description, size = '@2x') {
        return `https://openweathermap.org/img/wn/${iconCode}${size}.png`;
    }

    static formatDate(timestamp, options = { weekday: 'short' }) {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', options);
    }

    static displayCurrentWeather(weatherData) {
        if (!weatherData) return;

        const middleSection = document.querySelector('.middle-section');
        const weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-container';

        const {
            weather: [{ icon: iconCode, description }],
            main: { temp, humidity, temp_min: lowtemp, temp_max: hightemp },
            sys: { sunrise, sunset }
        } = weatherData;

        weatherContainer.innerHTML = `
            <div class="weather-main">
                <img src="${this.createWeatherIcon(iconCode, description)}" alt="${description}" class="weather-icon">
                <div class="temperature">${Math.round(temp)}°F</div>
            </div>
            <div class="weather-description">${description}</div>
            <div class="weather-details">
                <p>High: ${Math.round(hightemp)}°F</p>
                <p>Low: ${Math.round(lowtemp)}°F</p>
                <p>Humidity: ${humidity}%</p>
                <p>Sunrise: ${this.formatDate(sunrise)}</p>
                <p>Sunset: ${this.formatDate(sunset)}</p>
            </div>
        `;

        const heading = middleSection.querySelector('h2');
        heading.insertAdjacentElement('afterend', weatherContainer);
    }

    static displayForecast(forecastData) {
        if (!forecastData) return;

        const rightSection = document.querySelector('.right-section');
        const forecastContainer = document.createElement('div');
        forecastContainer.className = 'forecast-container';

        const nextThreeDays = this.processForecasts(forecastData.list);
        const forecastHTML = this.createForecastHTML(nextThreeDays);

        forecastContainer.innerHTML = forecastHTML;
        const heading = rightSection.querySelector('h2');
        heading.insertAdjacentElement('afterend', forecastContainer);
    }

    static processForecasts(forecasts) {
        const dailyForecasts = {};
        const currentDate = new Date();

        forecasts.forEach(forecast => {
            const forecastDate = new Date(forecast.dt * 1000);
            const dateString = forecastDate.toDateString();

            if (this.isSameDay(forecastDate, currentDate)) return;

            if (!dailyForecasts[dateString]) {
                dailyForecasts[dateString] = forecast;
            }
        });

        return Object.values(dailyForecasts).slice(0, 3);
    }

    static isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    static createForecastHTML(forecasts) {
        const forecastItems = forecasts.map(forecast => {
            const dayName = this.formatDate(forecast.dt);
            const { icon: iconCode, description } = forecast.weather[0];
            const temp = Math.round(forecast.main.temp);

            return `
                <div class="forecast-day">
                    <div class="forecast-date">${dayName}</div>
                    <img src="${this.createWeatherIcon(iconCode, description, '')}" alt="${description}" class="forecast-icon">
                    <div class="forecast-temp">${temp}°F</div>
                    <div class="forecast-desc">${description}</div>
                </div>
            `;
        }).join('');

        return `<h3>3-Day Forecast</h3><div class="three-day-forecast">${forecastItems}</div>`;
    }
}

// Configuration
const WEATHER_CONFIG = {
    lat: 41.4958,
    lon: -111.9438,
    apiKey: 'bd5e378503939ddaee76f12ad7a97608'
};

// Initialize weather functionality
async function initWeatherApp() {
    const weatherService = new WeatherService(
        WEATHER_CONFIG.lat,
        WEATHER_CONFIG.lon,
        WEATHER_CONFIG.apiKey
    );

    const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(),
        weatherService.getForecast()
    ]);

    WeatherUI.displayCurrentWeather(weatherData);
    WeatherUI.displayForecast(forecastData);
}

document.addEventListener('DOMContentLoaded', initWeatherApp);