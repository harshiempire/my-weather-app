// services/cronJobs.js

const cron = require("node-cron");
const { fetchWeatherData, fetchForecastData } = require("./dataFetcher");

const scheduleJobs = () => {
  // Scheduled task to fetch current weather data every 5 minutes
  cron.schedule("*/5 * * * *", fetchWeatherData);

  // Scheduled task to fetch forecast data every hour at minute 0
  cron.schedule("0 * * * *", fetchForecastData);
};

module.exports = scheduleJobs;