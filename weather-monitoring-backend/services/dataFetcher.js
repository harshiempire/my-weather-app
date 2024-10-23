// services/dataFetcher.js

const axios = require("axios");
const WeatherData = require("../models/WeatherData");
const ForecastData = require("../models/ForecastData");
const updateDailySummary = require("./updateSummary");
const cities = require("../config/cities");

const fetchWeatherData = async () => {
  console.log("Fetching weather data...");
  for (const city of cities) {
    try {
      // Fetch current weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: city.lat,
            lon: city.lon,
            units: "metric",
            appid: process.env.OPENWEATHER_API_KEY,
          },
        }
      );

      const weatherData = weatherResponse.data;
      const weatherEntry = new WeatherData({
        city: city.name,
        main: weatherData.weather[0].main,
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        dt: new Date(weatherData.dt * 1000),
      });

      await weatherEntry.save();
      console.log(`Current weather data saved for ${city.name}`);

      // Update daily summary
      await updateDailySummary(city.name, weatherEntry);
    } catch (error) {
      console.error(`Error fetching data for ${city.name}:`, error.message);
    }
  }
};

const fetchForecastData = async () => {
  console.log("Fetching forecast data...");
  for (const city of cities) {
    try {
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            lat: city.lat,
            lon: city.lon,
            units: "metric",
            appid: process.env.OPENWEATHER_API_KEY,
          },
        }
      );

      const forecastData = forecastResponse.data;
      const forecastEntry = new ForecastData({
        city: city.name,
        forecastList: forecastData.list.map((item) => ({
          dt: new Date(item.dt * 1000),
          temp: item.main.temp,
          feels_like: item.main.feels_like,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          pressure: item.main.pressure,
          humidity: item.main.humidity,
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          wind_speed: item.wind.speed,
          wind_deg: item.wind.deg,
          pop: item.pop,
          rain: item.rain ? item.rain["3h"] : 0,
          dt_txt: item.dt_txt,
        })),
        fetchedAt: new Date(),
      });

      await forecastEntry.save();
      console.log(`Forecast data saved for ${city.name}`);
    } catch (error) {
      console.error(`Error fetching forecast data for ${city.name}:`, error.message);
    }
  }
};

module.exports = {
  fetchWeatherData,
  fetchForecastData,
};