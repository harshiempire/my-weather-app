// src/components/WeatherDashboard.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CityContext } from "../CityContext";
import CurrentWeather from "./CurrentWeather";
import DailySummary from "./DailySummary";
import Forecast from "./Forecast";
import Settings from "./Settings"; // Import the Settings component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WeatherDashboard() {
  const {
    city,
    temperatureUnit,
    alertThreshold,
    fetchInterval,
    weatherConditions,
    setCity,
    tempExceedCount,
    setTempExceedCount,
  } = useContext(CityContext);
  
  const [currentWeather, setCurrentWeather] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch weather data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [currentRes, summaryRes, forecastRes] = await Promise.all([
        axios.get(`/api/weather/current?city=${city}`),
        axios.get(`/api/weather/summary?city=${city}`),
        axios.get(`/api/weather/forecast?city=${city}`),
      ]);

      // Update current weather
      setCurrentWeather(currentRes.data);

      // Update daily summaries
      setSummaries(summaryRes.data);

      // Transform and update forecast data
      const transformedForecast = forecastRes.data.map((item) => ({
        date: item.dt_txt,
        temp: temperatureUnit === "F" ? (item.temp * 9) / 5 + 32 : item.temp,
        feels_like:
          temperatureUnit === "F"
            ? (item.feels_like * 9) / 5 + 32
            : item.feels_like,
        humidity: item.humidity,
        wind_speed: item.wind_speed,
        condition: item.main,
      }));
      setForecastData(transformedForecast);

      // Handle alerts based on fetched data
      handleAlerts(currentRes.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast.error("Failed to fetch weather data. Please try again later.");
      setLoading(false);
    }
  };

  // Handle alert notifications based on thresholds
  const handleAlerts = (weatherData) => {
    const temp =
      temperatureUnit === "F"
        ? (weatherData.temp * 9) / 5 + 32
        : weatherData.temp;

    let alertTriggered = false;

    // Temperature Threshold Alert
    if (temp > alertThreshold.temp) {
      const newCount = tempExceedCount + 1;
      setTempExceedCount(newCount);
      if (newCount >= alertThreshold.consecutive) {
        toast.warn(
          `Temperature in ${city} has exceeded ${alertThreshold.temp}°${temperatureUnit} for ${alertThreshold.consecutive} consecutive updates!`
        );
        setTempExceedCount(0); // Reset count after alert
        alertTriggered = true;
      }
    } else {
      setTempExceedCount(0); // Reset count if threshold not met
    }

    // Specific Weather Conditions Alert
    if (alertThreshold.conditions.includes(weatherData.main)) {
      toast.info(`Weather condition in ${city}: ${weatherData.main}`);
      alertTriggered = true;
    }

    // Optionally, handle other alerts or aggregate multiple alerts
    if (!alertTriggered) {
      // No alert triggered this update
    }
  };

  // Fetch data on component mount and set up interval for polling
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, fetchInterval * 60000); // Convert minutes to milliseconds
    return () => clearInterval(intervalId);
  }, [city, temperatureUnit, alertThreshold, fetchInterval, weatherConditions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
          Weather Dashboard
        </h1>

        {/* Settings Component */}
        <Settings />

        {/* Weather Data Display */}
        <div className="mt-12">
          {/* City Selection */}
          <div className="mb-8">
            <label
              htmlFor="city-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select City:
            </label>
            <select
              id="city-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="block w-full sm:w-64 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            >
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-8">
              {/* Current Weather Skeleton */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              {/* Daily Summary Skeleton */}
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              {/* Forecast Skeleton */}
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          ) : (
            /* Weather Data Display */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Current Weather & Daily Summary */}
              <div className="lg:col-span-1 space-y-8">
                {/* Current Weather Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <CurrentWeather data={currentWeather} />
                </div>

                {/* Daily Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <DailySummary />
                </div>
              </div>

              {/* Right Column: 5-Day Forecast */}
              <div className="lg:col-span-2">
                {/* Forecast Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <Forecast data={forecastData} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Toast Notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}