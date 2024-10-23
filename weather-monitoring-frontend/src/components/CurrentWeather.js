// src/components/CurrentWeather.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CityContext } from "../CityContext";
import { toast } from "react-toastify";
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
} from "lucide-react";

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    city,
    setCity,
    temperatureUnit,
    alertThreshold,
    fetchInterval,
    tempExceedCount,
    setTempExceedCount,
  } = useContext(CityContext);

  // Function to fetch current weather data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/weather/current?city=${city}`);
      const data = response.data;
      setWeatherData(data);
      setLoading(false);

      // Convert temperature based on the selected unit
      const temp =
        temperatureUnit === "F" ? convertTemperature(data.temp) : data.temp;

      // Handle Temperature Threshold Alerts
      if (temp > alertThreshold.temp) {
        // Increment the count of consecutive updates exceeding the threshold
        const newCount = tempExceedCount + 1;
        setTempExceedCount(newCount);

        // Check if the count meets or exceeds the consecutive threshold
        if (newCount >= alertThreshold.consecutive) {
          toast.warn(
            `Temperature in ${city} has exceeded ${alertThreshold.temp}°${temperatureUnit} for ${newCount} consecutive updates!`
          );
          // Reset the count after alerting
          setTempExceedCount(0);
        }
      } else {
        // Reset the count if temperature is below the threshold
        if (tempExceedCount !== 0) {
          setTempExceedCount(0);
        }
      }

      // Handle Weather Condition Alerts using alertThreshold.conditions
      if (
        alertThreshold.conditions &&
        Array.isArray(alertThreshold.conditions) &&
        alertThreshold.conditions.includes(data.main)
      ) {
        toast.info(`Weather condition in ${city}: ${data.main}`);
      }
    } catch (error) {
      console.error("Error fetching current weather:", error);
      setLoading(false);
      toast.error(
        "Failed to fetch current weather data. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, fetchInterval * 60000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, temperatureUnit, alertThreshold, fetchInterval]);

  // Function to convert temperature based on unit
  const convertTemperature = (tempInCelsius) => {
    return temperatureUnit === "F"
      ? (tempInCelsius * 9) / 5 + 32
      : tempInCelsius;
  };

  // Function to get weather icon based on condition
  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase();

    switch (conditionLower) {
      case "clear":
        return <Sun className="w-16 h-16 text-yellow-400" />;
      case "clouds":
        return <Cloud className="w-16 h-16 text-gray-400" />;
      case "rain":
        return <CloudRain className="w-16 h-16 text-blue-400" />;
      case "drizzle":
        return <CloudDrizzle className="w-16 h-16 text-blue-300" />;
      case "thunderstorm":
        return <CloudLightning className="w-16 h-16 text-yellow-600" />;
      case "snow":
        return <Snowflake className="w-16 h-16 text-blue-200" />;
      case "mist":
      case "smoke":
      case "haze":
      case "dust":
      case "fog":
      case "sand":
      case "ash":
      case "squall":
        return <CloudFog className="w-16 h-16 text-gray-300" />;
      case "tornado":
        return <Wind className="w-16 h-16 text-gray-500" />;
      default:
        return <Wind className="w-16 h-16 text-gray-500" />;
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000); // Assuming timestamp is in seconds
    return date.toLocaleString();
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        {/* City Selection */}
        <div className="mb-6">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="city-select"
          >
            Select City:
          </label>
          <select
            id="city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
          >
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        ) : weatherData ? (
          <div className="space-y-4">
            {/* City and Icon */}
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                {weatherData.city}
              </h3>
              {getWeatherIcon(weatherData.main)}
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4">
              {/* Temperature */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Temperature
                </p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {convertTemperature(weatherData.temp).toFixed(1)}°
                  {temperatureUnit}
                </p>
              </div>

              {/* Feels Like */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Feels Like
                </p>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {convertTemperature(weatherData.feels_like).toFixed(1)}°
                  {temperatureUnit}
                </p>
              </div>

              {/* Condition */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Condition
                </p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {weatherData.main}
                </p>
              </div>

              {/* Humidity */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Humidity
                </p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  {weatherData.humidity}%
                </p>
              </div>
            </div>

            {/* Last Updated */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Updated at: {(weatherData.dt)}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No weather data available
          </p>
        )}
      </div>
    </div>
  );
}