// src/CityContext.js

import React, { createContext, useState, useEffect, useMemo } from "react";

// Create the context
export const CityContext = createContext();

// Create the provider component
export const CityProvider = ({ children }) => {
  // State for the selected city
  const [city, setCity] = useState("Delhi");

  // User Preferences
  const [temperatureUnit, setTemperatureUnit] = useState("C"); // 'C' or 'F'
  const [alertThreshold, setAlertThreshold] = useState({
    temp: 35, // Temperature threshold in °C or °F based on unit
    consecutive: 2, // Number of consecutive updates
    conditions: [], // Array of weather conditions to alert on
  });
  const [fetchInterval, setFetchInterval] = useState(5); // Fetch interval in minutes

  // To track consecutive updates exceeding temperature
  const [tempExceedCount, setTempExceedCount] = useState(0);

  // Load user preferences from localStorage on mount
  useEffect(() => {
    console.log("Loading preferences from localStorage");
    const storedPreferences = localStorage.getItem("userPreferences");
    if (storedPreferences) {
      try {
        const parsed = JSON.parse(storedPreferences);
        setTemperatureUnit(parsed.temperatureUnit || "C");
        setAlertThreshold(
          parsed.alertThreshold || { temp: 35, consecutive: 2, conditions: [] }
        );
        setFetchInterval(parsed.fetchInterval || 5); // Default to 5 minutes if not set
      } catch (error) {
        console.error("Error parsing userPreferences from localStorage:", error);
      }
    }
  }, []);

  // Save user preferences to localStorage whenever they change
  useEffect(() => {
    console.log("Saving preferences to localStorage");
    const preferences = {
      temperatureUnit,
      alertThreshold,
      fetchInterval,
    };
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  }, [temperatureUnit, alertThreshold, fetchInterval]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    return {
      city,
      setCity,
      temperatureUnit,
      setTemperatureUnit,
      alertThreshold,
      setAlertThreshold,
      fetchInterval,
      setFetchInterval,
      tempExceedCount,
      setTempExceedCount,
    };
  }, [
    city,
    temperatureUnit,
    alertThreshold,
    fetchInterval,
    tempExceedCount,
  ]);

  return (
    <CityContext.Provider value={contextValue}>
      {children}
    </CityContext.Provider>
  );
};
