import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CityContext } from "../CityContext";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

export default function DailySummary() {
  // **1. Hook Declarations**

  // Accessing context values
  const {
    city,
    setCity,
    temperatureUnit,
    alertThreshold,
    fetchInterval,
    tempExceedCount,
    setTempExceedCount,
  } = useContext(CityContext);

  // State for weather summaries and loading indicator
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  // **2. Fetch Summaries Function**

  // Function to fetch daily summaries
  const fetchSummaries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/weather/summary?city=${city}`);
      setSummaries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching summaries:", error);
      setLoading(false);
      toast.error("Failed to fetch daily summaries. Please try again later.");
    }
  }, [city]);

  // Debounced version of fetchSummaries to prevent rapid API calls
  const debouncedFetchSummaries = useCallback(
    debounce(fetchSummaries, 500), // 500ms delay; adjust as needed
    [fetchSummaries]
  );

  // **3. useEffect for Fetching Summaries**

  useEffect(() => {
    debouncedFetchSummaries();
    const intervalId = setInterval(debouncedFetchSummaries, fetchInterval * 60000); // Convert minutes to milliseconds
    return () => {
      clearInterval(intervalId);
      debouncedFetchSummaries.cancel(); // Cancel any pending debounced calls on unmount
    };
  }, [debouncedFetchSummaries, fetchInterval]);

  // **4. Alert Handling Function**

  const handleModalAlerts = (summary) => {
    const temp =
      temperatureUnit === "F"
        ? convertTemperature(summary.avgTemp)
        : summary.avgTemp;

    // Handle Temperature Threshold Alerts
    if (temp > alertThreshold.temp) {
      // Increment the count of consecutive updates exceeding the threshold
      const newCount = tempExceedCount + 1;
      setTempExceedCount(newCount);

      // Check if the count meets or exceeds the consecutive threshold
      if (newCount >= alertThreshold.consecutive) {
        toast.warn(
          `Average temperature on ${summary.date} in ${city} has exceeded ${alertThreshold.temp}°${temperatureUnit} for ${newCount} consecutive updates!`
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
      alertThreshold.conditions.includes(summary.dominantCondition)
    ) {
      toast.info(
        `Weather condition on ${summary.date} in ${city}: ${summary.dominantCondition}`
      );
    }
  };

  // **5. useEffect for Selected Summary Alerts**

  useEffect(() => {
    if (selectedSummary) {
      handleModalAlerts(selectedSummary);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSummary]);

  // **6. Helper Functions**

  // Function to get weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case "clear":
        return <Sun className="w-10 h-10 text-yellow-400" />;
      case "clouds":
        return <Cloud className="w-10 h-10 text-gray-400" />;
      case "rain":
        return <CloudRain className="w-10 h-10 text-blue-400" />;
      case "snow":
        return <Snowflake className="w-10 h-10 text-blue-200" />;
      default:
        return <Wind className="w-10 h-10 text-gray-500" />;
    }
  };

  // Function to prepare data for the graph
  const getGraphData = () => {
    if (!selectedSummary) return [];

    const avgTemp = temperatureUnit === "F" ? convertTemperature(selectedSummary.avgTemp) : selectedSummary.avgTemp;
    const maxTemp = temperatureUnit === "F" ? convertTemperature(selectedSummary.maxTemp) : selectedSummary.maxTemp;
    const minTemp = temperatureUnit === "F" ? convertTemperature(selectedSummary.minTemp) : selectedSummary.minTemp;

    return [
      {
        Metric: "Avg Temp",
        Value: avgTemp.toFixed(1),
        fill: "#8884d8",
      },
      {
        Metric: "Max Temp",
        Value: maxTemp.toFixed(1),
        fill: "#82ca9d",
      },
      {
        Metric: "Min Temp",
        Value: minTemp.toFixed(1),
        fill: "#ffc658",
      },
    ];
  };

  // **7. Temperature Conversion Function**

  const convertTemperature = (tempCelsius) => {
    return (tempCelsius * 9) / 5 + 32; // Convert Celsius to Fahrenheit
  };

  // **8. Modal Handlers**

  // Handler to open modal with selected summary
  const handleCardClick = (summary) => {
    setSelectedSummary(summary);
    setIsModalOpen(true);
  };

  // Handler to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSummary(null);
  };

  // **9. Timestamp Formatting Function**

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000); // Assuming timestamp is in seconds
    return date.toLocaleString();
  };

  // **10. JSX Return**

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Daily Weather Summary for {city}
      </h2>
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
          className="block w-full md:w-64 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition duration-150 ease-in-out"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="flex justify-between items-center mb-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : summaries.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {summaries.map((summary) => (
            <div
              key={`${summary.city}-${summary.date}`}
              onClick={() => handleCardClick(summary)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {summary.date}
                </h3>
                <div className="flex justify-between items-center mb-6">
                  {getWeatherIcon(summary.dominantCondition)}
                  <span className="text-4xl font-bold text-gray-700 dark:text-gray-300">
                    {temperatureUnit === "F"
                      ? `${convertTemperature(summary.avgTemp).toFixed(1)}°F`
                      : `${summary.avgTemp.toFixed(1)}°C`}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                    <span>Max Temperature:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {temperatureUnit === "F"
                        ? `${convertTemperature(summary.maxTemp).toFixed(1)}°F`
                        : `${summary.maxTemp.toFixed(1)}°C`}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                    <span>Min Temperature:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {temperatureUnit === "F"
                        ? `${convertTemperature(summary.minTemp).toFixed(1)}°F`
                        : `${summary.minTemp.toFixed(1)}°C`}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                    <span>Condition:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {summary.dominantCondition}
                    </span>
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: {summary.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          No weather summaries available.
        </p>
      )}

      {/* Modal for Detailed Graph */}
      {isModalOpen && selectedSummary && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-4xl p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <h2
              id="modal-title"
              className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center"
            >
              Detailed Weather Data for {selectedSummary.date}
            </h2>

            {/* Graph */}
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={getGraphData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Value" fill="#8884d8" name={`Temperature (${temperatureUnit}°)`} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
