// services/updateSummary.js

const DailySummary = require("../models/DailySummary");

const updateDailySummary = async (cityName, weatherData) => {
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
};

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

module.exports = updateDailySummary;