# Weather Dashboard Application

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Demo](#demo)
   - [Daily Weather](#daily-weather)
   - [Daily Weather Summary](#daily-weather-summary)
   - [Forecast](#forecast)
   - [City Selection](#city-selection)
   - [Settings Page](#settings-page)
   - [Weather in Fahrenheit](#weather-in-fahrenheit)
   - [Temperature and Weather Based Alerts](#temperature-and-weather-based-alerts)
5. [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Setup Instructions](#setup-instructions)
     1. [Clone the Repository](#1-clone-the-repository)
     2. [Start the MongoDB Database using Docker](#2-start-the-mongodb-database-using-docker)
        - [OR](#or)
     3. [Backend Setup](#3-backend-setup)
        - [a. Navigate to the Backend Directory](#a-navigate-to-the-backend-directory)
        - [b. Install Backend Dependencies](#b-install-backend-dependencies)
        - [c. Configure Backend Environment Variables](#c-configure-backend-environment-variables)
        - [d. Start the Backend Server](#d-start-the-backend-server)
     4. [Frontend Setup](#4-frontend-setup)
        - [a. Navigate to the Frontend Directory](#a-navigate-to-the-frontend-directory)
        - [b. Install Frontend Dependencies](#b-install-frontend-dependencies)
        - [c. Start the Frontend Application](#c-start-the-frontend-application)
     5. [Access the Weather Dashboard](#5-access-the-weather-dashboard)
6. [Configuration](#configuration)
   - [API Integration](#api-integration)
   - [Environment Variables](#environment-variables)
7. [Usage](#usage)
8. [Project Structure](#project-structure)
   - [Frontend](#frontend)
   - [Backend](#backend)
9. [Non-Functional Considerations](#non-functional-considerations)
   - [Security Enhancements](#security-enhancements)
   - [Performance Optimizations](#performance-optimizations)
   - [Scalability Considerations](#scalability-considerations)
10. [Test Cases](#test-cases)
11. [Bonus](#bonus)

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
![DailySummariesinText](./screenshots/DailySummary%20with%20Gemini%20Summarize.png)

#### Daily Weather Summary

- Provides a daily summary of weather data, including maximum, minimum, and average temperatures.
- This image reflects the daily rollup and aggregate functionality mentioned in the project, which stores summarized data for further analysis.

---

![Forecast](./screenshots/Forecast.png)

#### Forecast

- Offers a graphical representation of weather forecasts over the next five days, showing trends in temperature, humidity, and wind speed.

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

-     Represents the alert system functionality that notifies users when predefined thresholds, such as temperature exceeding a certain value (like 25°C and 32°C for consecutive updates), are breached.
- The notification provides a simple update about the weather condition in the selected city, reinforcing the continuous weather monitoring aspect of the system.

## Installation

### Prerequisites

- **Node.js:**
- **npm:** - Node Package Manager.
- **Docker:** (for running the MongoDB database)

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/harshiempire/my-weather-app.git
   cd my-weather-app
   ```

2. **Start the MongoDB Database using Docker (Skip to next step if no docker)**

   ```bash
   docker pull mongo
   docker run -d -p 27017:27017 --name mongo-weather mongo:latest
   ```

   This will:

   - Pull the MongoDB image from Docker Hub.
   - Run MongoDB in detached mode (`-d`), mapping the container's port 27017 to your local machine's port 27017.
   - Name the container `mongo-weather` for easy reference.

   #### OR

   - If setting using Docker is a hassle, in the `.env.example`, I have provided the MongoDB Atlas URI where the username and password `realadmin`
   - `mongodb+srv://username:passwrod@cluster0.p3phjsx.mongodb.net/` refer step 3. **Backend Setup**

- Also provided the `OPENWEATHERMAP API` for easier setup
- Don't forget to create `.env` or else the setup wouldn't work as in the next step

3. **Backend Setup**

   a. **Navigate to the Backend Directory**

   ```bash
   cd weather-monitoring-backend
   ```

   b. **Install Backend Dependencies**

   ```bash
   npm install
   ```

   c. **Configure Backend Environment Variables** (Step can be **skipped** as added the .env file for convenience)

   Create a `.env` file in the `weather-monitoring-backend` directory with the following content for **local setup** done with docker or if already present:

   ```env
   OPENWEATHER_API_KEY=95e73333b1f491ae8676b1bb9588274a
   MONGO_URI=mongodb://localhost:27017
   GEMINI_API_KEY=AIzaSyCHBfiXfzFrehhldrjnWQDbBHkyXZEVXaA
   ```

   ***

   For easier and **cloud setup** of `MONOGODB` (Without Docker)

   ```env
   OPENWEATHER_API_KEY=95e73333b1f491ae8676b1bb9588274a
   MONGO_URI=mongodb+srv://realadmin:realadmin@cluster0.p3phjsx.mongodb.net/
   GEMINI_API_KEY=AIzaSyCHBfiXfzFrehhldrjnWQDbBHkyXZEVXaA

   ```

   - Replace `your_openweathermap_api_key` with your actual OpenWeatherMap API key (get one from [https://openweathermap.org/api](https://openweathermap.org/api)) if not provided in the `.env.example`.
   - Ensure that `MONGODB_URI` points to the MongoDB instance you started with Docker.
   - Replace Cloud setup env file with `realadmin` as username and password

   d. **Start the Backend Server**

   ```bash
   npm start
   ```

   The backend server will run on `http://localhost:5001`.

4. **Frontend Setup**

   Open a new terminal window or tab for the frontend setup. And navigate to the `weather-app` directory or if at the `weather-monitoring-backend` directory

   a. **Navigate to the Frontend Directory**

   ```bash
   cd weather-monitoring-frontend # at weather-app directory
   ```
   ```bash
   cd ../weather-monitoring-frontend # at weather-monitoring-backend directory
   ```

   b. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

   c. **Start the Frontend Application**

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
         "_id": "67188216560e008def4d4a1a",
         "city": "Delhi",
         "date": "2024-10-23",
         "temperatures": [28.06, 28.06, 28.06, 29.06, 29.06, 29.06, 29.06],
         "conditions": ["Haze", "Haze", "Haze", "Haze", "Haze", "Haze", "Haze"],
         "avgTemp": 28.631428571428568,
         "maxTemp": 29.06,
         "minTemp": 28.06,
         "dominantCondition": "Haze",
         "__v": 6
       }
       // ... other summaries
     ]
     ```

3. **Forecast**

   - **Endpoint**: `/api/weather/forecast`
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
         "dt": "2024-10-23T18:00:00.000Z",
         "temp": 27.94,
         "feels_like": 26.68,
         "temp_min": 27.94,
         "temp_max": 27.94,
         "pressure": 1011,
         "humidity": 19,
         "main": "Clear",
         "description": "clear sky",
         "icon": "01n",
         "wind_speed": 2.15,
         "wind_deg": 336,
         "pop": 0,
         "rain": 0,
         "dt_txt": "2024-10-23 18:00:00",
         "_id": "67188a88c791fb77e280fe67"
       }
       // ... other dates forecast
     ]
     ```

### Environment Variables

- **`OPENWEATHERMAP_API_KEY`**: API key for fetching weather data.
- **`MONGO_URI`**: - URI for connecting to the MongoDB database

_Ensure that these variables are correctly set in your `.env` file._

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
   - Getting the Summaries of weather condition using gemini ai

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
│   ├── Alert.png
│   ├── Current Weather.png
│   ├── Daily Weather Summary.png
│   ├── Forecast.png
│   ├── Selecting cities.png
│   ├── Settings.png
│   ├── Weather Condition.jpg
│   └── Weather in fahrenheit.png
├── weather-monitoring-backend
│   ├── config
│   │   └── cities.js
│   ├── controllers
│   │   └── weatherController.js
│   ├── models
│   │   ├── DailySummary.js
│   │   ├── ForecastData.js
│   │   └── WeatherData.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes
│   │   └── api.js
│   ├── server.js
│   └── services
│       ├── cronJobs.js
│       ├── dataFetcher.js
│       └── updateSummary.js
└── weather-monitoring-frontend
    ├── README.md
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── favicon.ico
    │   ├── index.html
    │   ├── logo192.png
    │   ├── logo512.png
    │   ├── manifest.json
    │   └── robots.txt
    ├── src
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── CityContext.js
    │   ├── components
    │   │   ├── CurrentWeather.js
    │   │   ├── DailySummary.js
    │   │   ├── ErrorBoundary.js
    │   │   ├── Forecast.js
    │   │   ├── Settings.js
    │   │   └── WeatherDashboard.js
    │   ├── index.css
    │   ├── index.js
    │   ├── logo.svg
    │   ├── reportWebVitals.js
    │   └── setupTests.js
    └── tailwind.config.js
```

### Key Directories and Files

#### Frontend

- `src/components/`: React components used in the application.
  - `CurrentWeather.js`: Displays current weather data.
  - `DailySummary.js`: Shows daily weather summaries with interactive graphs.
  - `Settings.js`: Allows users to customize preferences.
  - `ErrorBoundary.js`: Handles rendering errors gracefully.
- `src/context/CityContext.js`: Implements React Context for state management.
- `src/hooks/`: Custom React hooks for reusable logic (e.g., data fetching).
- `public/`: Contains the HTML template and static assets.
- `.env`: Environment variables for configuration (not committed to version control).

#### Backend

- `config/`: Configuration files.

* `cities.js`: Defines the list of cities to monitor with their coordinates.

- `controllers/`: Handles incoming API requests.

* `weatherController.js`: Manages weather-related API endpoints.

- `models/`: Mongoose schemas and models for MongoDB.
  - `WeatherData.js`: Schema for current weather data.
  - `DailySummary.js`: Schema for daily weather summaries.
  - `ForecastData.js`: Schema for weather forecast data.
- `routes/`: Defines API endpoints and associates them with controllers.
  - `api.js`: Main router file for the API.
- `services/`: Business logic and interactions with external APIs.
  - `dataFetcher.js`: Functions to fetch weather data from external APIs.
  - `updateSummary.js`: Functions to process and update daily summaries.
  - `cronJobs.js`: Schedules tasks to fetch data at regular intervals.
- `server.js`: Main entry point of the backend application.

* Sets up the Express server, connects to MongoDB, initializes middleware, and starts the server.
* Imports and starts cron jobs for data fetching.

## Non-Functional Considerations

### Security Enhancements

- **Input Validation**: Implement validation on all API endpoints to ensure incoming data conforms to expected formats and types, preventing malicious inputs and injections.
- **Environment Variables**: Use environment variables to store sensitive information such as API keys and database credentials, ensuring they are not exposed in the codebase or version control.
- **CORS Configuration**: Configure Cross-Origin Resource Sharing (CORS) policies to restrict API access to trusted origins, enhancing the security of API communications.

### Performance Optimizations

- **Efficient Data Fetching**: Minimize API calls to external services by scheduling data fetching at optimal intervals and storing results in the database for quick retrieval.
- **Debouncing**: Implement lodash.debounce on the frontend to limit the rate of function execution, reducing unnecessary API calls during rapid user input events.
- **Resource Management**: Use connection pooling and ensure proper handling of database connections to optimize resource usage.

### Scalability Considerations

- **Modular Architecture**: Adopt a modular code structure, separating concerns into controllers, services, and models, facilitating easier maintenance and scalability.
- **Stateless Backend**: Design the backend to be stateless, allowing for horizontal scaling through load balancers without session management issues.
- **Configurable Parameters**: Make key parameters such as the list of monitored cities and data fetch intervals configurable, allowing the system to adapt to different requirements without code changes.
- **Database Indexing**: Add indexes to frequently queried fields in MongoDB collections to improve read performance and support scaling to larger datasets.

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

```bash
- Ensure the system retrieves weather data for the specified location and parses the response correctly.
```

- Right now, the Application retrivies the weather data for metropolitan cities (as the free API from OpenWeatherMap requires Latitute and Longitude Coordinates)

3. Temperature Conversion:

```bash
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

- 5 Day Forecast is retrived and displayed in the form of a line graph representing temp, feels_like, humidity, wind speed and generating summaries using gemini ai
