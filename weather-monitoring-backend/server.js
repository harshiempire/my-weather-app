require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const WeatherData = require("./models/WeatherData");
const DailySummary = require("./models/DailySummary");
const ForecastData = require("./models/ForecastData");

// Cities to monitor
const cities = [
  { name: "Delhi", lat: 28.7041, lon: 77.1025 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
];

// Function to fetch weather data for all cities
async function fetchWeatherData() {
  console.log("Fetching weather data...");
  for (const city of cities) {
    try {
      // Fetch current weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
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
}

// Function to fetch forecast data for all cities
async function fetchForecastData() {
  console.log("Fetching forecast data...");
  for (const city of cities) {
    try {
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
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
}

// Scheduled task to fetch current weather data every 5 minutes
cron.schedule("*/5 * * * *", fetchWeatherData);

// Scheduled task to fetch forecast data every hour at minute 0
cron.schedule("0 * * * *", fetchForecastData);

// Function to update daily summary
async function updateDailySummary(cityName, weatherData) {
  const date = weatherData.dt.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format

  const existingSummary = await DailySummary.findOne({
    city: cityName,
    date: date,
  });

  if (existingSummary) {
    existingSummary.temperatures.push(weatherData.temp);
    existingSummary.conditions.push(weatherData.main);
    existingSummary.avgTemp =
      existingSummary.temperatures.reduce((a, b) => a + b, 0) /
      existingSummary.temperatures.length;
    existingSummary.maxTemp = Math.max(...existingSummary.temperatures);
    existingSummary.minTemp = Math.min(...existingSummary.temperatures);
    existingSummary.dominantCondition = getDominantCondition(
      existingSummary.conditions
    );

    await existingSummary.save();
  } else {
    const dailySummary = new DailySummary({
      city: cityName,
      date: date,
      temperatures: [weatherData.temp],
      conditions: [weatherData.main],
      avgTemp: weatherData.temp,
      maxTemp: weatherData.temp,
      minTemp: weatherData.temp,
      dominantCondition: weatherData.main,
    });
    await dailySummary.save();
  }
}

// Function to get dominant weather condition
function getDominantCondition(conditions) {
  const conditionCount = {};
  conditions.forEach((condition) => {
    conditionCount[condition] = (conditionCount[condition] || 0) + 1;
  });
  return Object.keys(conditionCount).reduce((a, b) =>
    conditionCount[a] > conditionCount[b] ? a : b
  );
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Fetch data immediately upon server startup
  await fetchWeatherData();
  await fetchForecastData();
});