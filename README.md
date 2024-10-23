# Weather Dashboard Application


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Demo](#demo)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Overview

The **Weather Dashboard** is a comprehensive web application that provides real-time and summarized weather information for various cities. Built with React, the application leverages modern web development practices and libraries to deliver a responsive, interactive, and user-friendly experience. Users can view current weather conditions, daily summaries, set personalized alerts, and customize their preferences.

## Features

- **Current Weather Display**: View real-time weather data including temperature, humidity, and conditions for selected cities.
- **Daily Summary**: Access summarized weather information with detailed graphs for each day.
- **User Preferences**:
  - **Temperature Unit**: Toggle between Celsius (°C) and Fahrenheit (°F).
  - **Alert Thresholds**: Set custom temperature thresholds and weather condition alerts.
  - **Data Fetch Interval**: Customize how frequently the application fetches new data.
- **Interactive Graphs**: Visualize temperature metrics using dynamic bar charts.
- **Responsive Design**: Optimized for various screen sizes and devices.
- **Dark Mode Support**: Seamlessly switch between light and dark themes.
- **Real-time Notifications**: Receive toast notifications for significant weather events based on user-defined alerts.
- **Persistent Settings**: User preferences are saved locally to ensure a consistent experience across sessions.

## Technologies Used

- **Frontend**:
  - React
  - Tailwind CSS
  - React Toastify
  - Recharts
  - Lucide React
  - Axios
  - Lodash debounce

- **Backend**:
  - Express
  - Axios
  - Mongoose
  - node-cron
  - dotenv

## Demo

![WeatherDemo](./screenshots/Current%20Weather.png)

#### Daily Weather

- Displays real-time weather data for a selected city. This corresponds to the core function of continuously retrieving and displaying weather conditions from the OpenWeatherMap API.
- Includes temperature, feels-like temperature, and weather condition, showcasing real-time updates as described in the application objectives.
---

![DailySummaries](./screenshots/Daily%20Weather%20Summary.png)
#### Daily Weather Summary

- Provides a daily summary of weather data, including maximum, minimum, and average temperatures.
- This image reflects the daily rollup and aggregate functionality mentioned in the project, which stores summarized data for further analysis.
---

![Forecast](./screenshots/Forecast.png)

#### Forecast 

- Offers a graphical representation of weather forecasts over the next five days, showing trends in temperature, humidity, and wind speed.
- Although forecasts aren't explicitly mentioned as part of the initial requirements, this visualization enhances the application's usefulness, showcasing future conditions for better planning.
---

![CitySelection](./screenshots/Selecting%20cities.png)

#### City Selection


- Allows users to select different metro cities for real-time weather data, which aligns with the requirement to monitor weather for various Indian metros (Delhi, Mumbai, Chennai, etc.).
- It shows how the system supports tracking weather in multiple locations, as expected from the system’s design.
---

![Settings](./screenshots/Settings.png)

#### Settings Page:
- Represents the user-configurable settings where thresholds for alerts, temperature units, and data fetch intervals can be customized.
- This page ties into the functionality for setting temperature thresholds and adjusting system behavior for real-time data retrieval as outlined in the application objectives.
---

![WeatherinFahrenheit](./screenshots/Weather%20in%20fahrenheit.png)

#### Weather in Fahrenheit
- Demonstrates the system’s ability to switch between temperature units (Celsius/Fahrenheit), fulfilling the requirement to convert temperature based on user preferences.
- Highlights the flexibility of the system in displaying data in different formats.
---

![Alert for temperature excedding](./screenshots/Alert.png)
![Alert for weather condition](./screenshots/Weather%20Condition.jpg)

#### Temperature and Weather Based Alerts
- 	Represents the alert system functionality that notifies users when predefined thresholds, such as temperature exceeding a certain value (like 25°C and 32°C for consecutive updates), are breached.
- The notification provides a simple update about the weather condition in the selected city, reinforcing the continuous weather monitoring aspect of the system.


## Installation

### Prerequisites

- **Node.js:**  - Download and install from [https://nodejs.org/](https://nodejs.org/).
- **npm:** - Node Package Manager.
- **Docker:** (for running the MongoDB database) - Download and install from [https://www.docker.com/](https://www.docker.com/).

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Start the MongoDB Database using Docker**

   ```bash
   docker pull mongo
   docker run -d -p 27017:27017 --name mongo-weather mongo:latest
   ```

   This will:
   - Pull the MongoDB image from Docker Hub.
   - Run MongoDB in detached mode (`-d`), mapping the container's port 27017 to your local machine's port 27017.
   - Name the container `mongo-weather` for easy reference.

3. **Backend Setup**

   a. **Navigate to the Backend Directory**

      ```bash
      cd weather-monitoring-backend
      ```

   b. **Install Backend Dependencies**

      ```bash
      npm install
      ```

   c. **Configure Backend Environment Variables**

      Create a `.env` file in the `weather-monitoring-backend` directory with the following content:

      ```env
      MONGODB_URI=mongodb://localhost:27017
      OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
      ```

      - Replace `your_openweathermap_api_key` with your actual OpenWeatherMap API key (get one from [https://openweathermap.org/api](https://openweathermap.org/api)).
      - Ensure that `MONGODB_URI` points to the MongoDB instance you started with Docker.

   d. **Start the Backend Server**

      ```bash
      npm start
      ```

      The backend server will run on `http://localhost:5001`.

4. **Frontend Setup**

   Open a new terminal window or tab for the frontend setup.

   a. **Navigate to the Frontend Directory**

      ```bash
      cd ../weather-monitoring-frontend
      ```

   b. **Install Frontend Dependencies**

      ```bash
      npm install
      ```

   c. **Configure Frontend Environment Variables**

      Create a `.env` file in the `weather-monitoring-frontend` directory with the following content:

      ```env
      REACT_APP_API_BASE_URL=http://localhost:5000/api
      ```

      Ensure that `REACT_APP_API_BASE_URL` matches the backend server's API endpoint.

   d. **Start the Frontend Application**

      ```bash
      npm start
      ```

      The frontend application will be accessible at `http://localhost:3000`.

5. **Access the Weather Dashboard**

   Open your web browser and navigate to `http://localhost:3000` to use the Weather Dashboard application.

## Configuration

### API Integration

The frontend expects certain API endpoints to fetch weather data. Ensure that your backend server provides the following endpoints:

1. **Current Weather**

   - **Endpoint**: `/api/weather/current`
   - **Method**: `GET`
   - **Query Parameters**:
     - `city` (string) - Name of the city (e.g., `Delhi`)
   - **Sample Request**:

     ```
     GET /api/weather/current?city=Delhi
     ```

   - **Sample Response**:

     ```json
     {
       "city": "Delhi",
       "temp": 30.5,
       "feels_like": 32.0,
       "main": "Clear",
       "humidity": 40,
       "dt": 1700000000
     }
     ```

2. **Daily Weather Summary**

   - **Endpoint**: `/api/weather/summary`
   - **Method**: `GET`
   - **Query Parameters**:
     - `city` (string) - Name of the city (e.g., `Delhi`)
   - **Sample Request**:

     ```
     GET /api/weather/summary?city=Delhi
     ```

   - **Sample Response**:

     ```json
     [
       {
         "city": "Delhi",
         "date": "2024-04-27",
         "avgTemp": 28.5,
         "maxTemp": 32.0,
         "minTemp": 24.0,
         "dominantCondition": "Clear"
       },
       // ... other summaries
     ]
     ```

### Environment Variables

- **`OPENWEATHERMAP_API_KEY`**: (If using OpenWeatherMap) API key for fetching weather data.

*Ensure that these variables are correctly set in your `.env` file.*

## Usage

1. **Select a City**

   - Use the city selector dropdown to choose the city for which you want to view weather data.
   - The application fetches and displays current weather information and daily summaries for the selected city.

2. **View Current Weather**

   - The **Current Weather** component displays real-time data including temperature, humidity, and weather conditions.
   - Icons representing the current weather condition are displayed for visual clarity.

3. **Access Daily Summary**

   - The **Daily Summary** section provides a summarized view of the weather over the past days.
   - Click on any summary card to open a modal with detailed graphs showing temperature metrics.

4. **Customize Settings**

   - Navigate to the **Settings** component to customize your preferences:
     - **Temperature Unit**: Toggle between Celsius and Fahrenheit.
     - **Alert Thresholds**: Set temperature thresholds and select weather conditions for which you want to receive alerts.
     - **Data Fetch Interval**: Adjust how frequently the application fetches new data (in minutes).

5. **Receive Notifications**

   - Based on your settings, the application will display toast notifications for significant weather events, such as temperature exceeding thresholds or specific weather conditions being met.

## Project Structure

```
.
├── README.md
├── screenshots
│   ├── Alert.png
│   ├── Current Weather.png
│   ├── Daily Weather Summary.png
│   ├── ...
├── weather-monitoring-backend
│   ├── controllers
│   │   └── weatherController.js
│   ├── models
│   │   ├── DailySummary.js
│   │   ├── ForecastData.js
│   │   ├── ...
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   |__ api.js
│   └── server.js
└── weather-monitoring-frontend
    ├── README.md
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── ...
    ├── src
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── CityContext.js
    │   ├── components
    │   ├── index.css
    │   ├── index.js
    │   ├── ...
    └── tailwind.config.js
```

### Key Directories and Files

- **`src/components/`**: Contains all React components used in the application.
  - **`CurrentWeather.js`**: Displays current weather data.
  - **`DailySummary.js`**: Shows daily weather summaries with interactive graphs.
  - **`Settings.js`**: Allows users to customize preferences.
  - **`ErrorBoundary.js`**: Catches and handles rendering errors gracefully.
  
- **`src/context/CityContext.js`**: Implements React Context for state management across the application.

- **`src/hooks/`**: Contains custom React hooks for reusable logic (e.g., data fetching).

- **`src/assets/screenshots/`**: Stores images and GIFs used in the README and documentation.

- **`public/`**: Contains the HTML template and static assets.

- **`.env`**: Environment variables for configuration (not committed to version control).

**`controllers/`**: This directory houses the controller functions, which act as the primary handlers for incoming API requests. Each controller is responsible for a specific set of functionalities.

- **`weatherController.js`**: Handles all aspects of weather data retrieval and processing. It acts as the intermediary between external weather services (like OpenWeatherMap) and the application's database. Its responsibilities include:
    - Fetching Current Weather:  Retrieves real-time weather data for a given city.
    - Fetching Daily Summaries: Retrieves daily weather summaries, including average, maximum, and minimum temperatures, and dominant weather conditions for each day.
    - Fetching Forecasts:  Retrieves weather forecasts for a given city.

**`models/`**: Contains Mongoose schemas and models, which define the structure and relationships of the data stored in the MongoDB database.

- **`DailySummary.js`**:  Defines the schema for storing daily weather summaries, including fields like `city`, `date`, `temperatures` (an array of temperatures for the day), `conditions` (an array of weather conditions for the day), `avgTemp`, `maxTemp`, `minTemp`, and `dominantCondition` (the most prevalent weather condition during the day).

- **`ForecastData.js`**:  Defines the schema for storing weather forecast data retrieved from external APIs. It typically stores fields like `city`, `forecastList` (an array of forecast data points for each time interval), and `fetchedAt` (timestamp).

**`routes/`**:  Defines the API endpoints that allow external applications (like the frontend) to interact with the backend. Each route specifies a URL path and links it to a controller function.

- **`api.js`**: The main router file that combines different route modules and applies middleware. It typically includes routes related to weather data, such as `/weather/current`, `/weather/summary`, and `/weather/forecast`.

**`services/`**:  Contains business logic and functions that interact with external APIs or perform complex operations.

- **`weatherService.js`**:  Handles communication with the OpenWeatherMap API. It includes functions for fetching current weather data, daily summaries, and forecasts. This service usually processes and formats the data before passing it to the controllers.

**`server.js`**: The main entry point of the backend application. 

- **Server Setup:** Sets up the Express server and configures middleware, such as `express.json()` for parsing JSON requests and `cors` for handling Cross-Origin Resource Sharing (CORS).
- **Database Connection:** Connects to the MongoDB database using Mongoose, utilizing the connection string specified in the `.env` file.

## Test Cases:
1. System Setup:
```bash
 -  Verify system starts successfully and connects to the OpenWeatherMap API using a valid API key.
```
- Verified the Connection to OpenWeatherMap using a valid API key
2. Data Retrieval:
```bash
- Simulate API calls at configurable intervals.
```
- Set configurable interval in the frontend for user to set, where it can be in the range of 1 to 59
``` bash
- Ensure the system retrieves weather data for the specified location and parses the response correctly.
```
- Right now, the Application retrivies the weather data for metropolitan cities (as the free API from OpenWeatherMap requires Latitute and Longitude Coordinates)


3. Temperature Conversion:
``` bash
- Test conversion of temperature values from Kelvin to Celsius (or Fahrenheit) based on user preference.
```
- The Temperature retrived from the OpenWeatherMap is already in Celsius, hence gave user preference of choosing between Celsius and Fahrenheit
4. Daily Weather Summary:
 ```bash
- Simulate a sequence of weather updates for several days.
```
- I have understood this in a certain way where, first I have created a collection in the database for daily summaries and started storing the temperatures for that day in an array. Fetched them to the frontend presenting the cummulatives  
```bash
- Verify that daily summaries are calculated correctly, including average, maximum, minimum temperatures,and dominant weather condition.
```
- Verfied the all the metrics and the dominant weather condition is also being stored in the database and showing the condition with more count

5. Alerting Thresholds:
```bash
- Define and configure user thresholds for temperature or weather conditions.
```
- The user by going to the settings page of the application. They can configure both the threshold for the temperature and weather condition
```bash
- Simulate weather data exceeding or breaching the thresholds.
```
- Successfully simulated the threshold exceeding scenarios
```bash
- Verify that alerts are triggered only when a threshold is violated.
```
- Verfied them to be correct alerts

## Bonus
 

```bash
Explore functionalities like weather forecasts retrieval and generating summaries based
on predicted conditions.
```
- 5 Day Forecast is retrived and displayed in the form of a line graph representing temp, feels_like, humidity, wind speed


