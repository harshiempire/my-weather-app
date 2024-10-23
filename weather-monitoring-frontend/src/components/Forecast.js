import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CityContext } from "../CityContext";

export default function Forecast() {
  const { city, setCity, temperatureUnit, fetchInterval, alertThreshold } =
    useContext(CityContext);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`/api/weather/forecast?city=${city}`)
      .then((response) => {
        const transformedData = response.data.map((item) => ({
          date: item.dt_txt,
          temp: temperatureUnit === "F" ? (item.temp * 9) / 5 + 32 : item.temp,
          feels_like:
            temperatureUnit === "F"
              ? (item.feels_like * 9) / 5 + 32
              : item.feels_like,
          humidity: item.humidity,
          wind_speed: item.wind_speed,
        }));
        setForecastData(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching forecast:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, fetchInterval * 60000);
    return () => clearInterval(intervalId);
  }, [city, temperatureUnit, alertThreshold, fetchInterval]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        5-Day Forecast for {city}
      </h2>
      <div className="mb-6">
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
          className="block w-full md:w-64 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
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
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ) : forecastData.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getDate()}/${
                    date.getMonth() + 1
                  } ${date.getHours()}:00`;
                }}
              />
              <YAxis unit={`°${temperatureUnit}`} stroke="#9CA3AF" />
              <Tooltip
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value, name) => [
                  `${value.toFixed(2)}°${temperatureUnit}`,
                  name.replace("_", " "),
                ]}
                contentStyle={{ backgroundColor: "rgba(17, 24, 39, 0.8)", color: "#E5E7EB", border: "1px solid #4B5563" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#8884d8"
                name={`Temp (°${temperatureUnit})`}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#82ca9d"
                name={`Feels Like (°${temperatureUnit})`}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#ffc658"
                name="Humidity (%)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="wind_speed"
                stroke="#ff7300"
                name="Wind Speed (m/s)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No forecast data available.</p>
      )}
    </div>
  );
}