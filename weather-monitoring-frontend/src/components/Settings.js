// src/components/Settings.js

import React, { useContext, useState } from "react";
import { CityContext } from "../CityContext";
import { toast } from "react-toastify";

export default function Settings() {
  const {
    temperatureUnit,
    setTemperatureUnit,
    alertThreshold,
    setAlertThreshold,
    fetchInterval,
    setFetchInterval,
  } = useContext(CityContext);

  // Local state to manage form inputs
  const [tempThreshold, setTempThreshold] = useState(alertThreshold.temp);
  const [consecutiveUpdates, setConsecutiveUpdates] = useState(
    alertThreshold.consecutive
  );
  const [selectedConditions, setSelectedConditions] = useState(
    alertThreshold.conditions
  );
  const [localFetchInterval, setLocalFetchInterval] = useState(fetchInterval);

  // Available weather conditions for alerts
  const availableConditions = [
    "Clear",
    "Clouds",
    "Rain",
    "Drizzle",
    "Thunderstorm",
    "Snow",
    "Mist",
    "Smoke",
    "Haze"
  ];

  const handleConditionChange = (condition) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (tempThreshold <= 0) {
      toast.error("Temperature threshold must be greater than 0.");
      return;
    }

    if (consecutiveUpdates <= 0) {
      toast.error("Consecutive updates must be at least 1.");
      return;
    }

    if (localFetchInterval <= 0) {
      toast.error("Fetch interval must be at least 1 minute.");
      return;
    }

    // Update alert threshold
    setAlertThreshold({
      temp: parseFloat(tempThreshold),
      consecutive: parseInt(consecutiveUpdates),
      conditions: selectedConditions,
    });

    // Update fetch interval
    setFetchInterval(parseInt(localFetchInterval));

    toast.success("Settings have been updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Settings
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Temperature Unit Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Temperature Unit:
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="temperatureUnit"
                value="C"
                checked={temperatureUnit === "C"}
                onChange={() => setTemperatureUnit("C")}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Celsius (°C)
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="temperatureUnit"
                value="F"
                checked={temperatureUnit === "F"}
                onChange={() => setTemperatureUnit("F")}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Fahrenheit (°F)
              </span>
            </label>
          </div>
        </div>

        {/* Alert Threshold */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Temperature Alert Threshold:
          </label>
          <input
            type="number"
            value={tempThreshold}
            onChange={(e) => setTempThreshold(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.1"
            required
          />
        </div>

        {/* Consecutive Updates */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Consecutive Updates:
          </label>
          <input
            type="number"
            value={consecutiveUpdates}
            onChange={(e) => setConsecutiveUpdates(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        {/* Weather Conditions for Alerts */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Weather Conditions for Alerts:
          </label>
          <div className="flex flex-wrap">
            {availableConditions.map((condition) => (
              <label key={condition} className="mr-4 mb-2 flex items-center">
                <input
                  type="checkbox"
                  value={condition}
                  checked={selectedConditions.includes(condition)}
                  onChange={() => handleConditionChange(condition)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  {condition}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Fetch Interval */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Fetch Interval (minutes):
          </label>
          <input
            type="number"
            value={localFetchInterval}
            onChange={(e) => setLocalFetchInterval(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="60"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}