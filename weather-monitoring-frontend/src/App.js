import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import CurrentWeather from "./components/CurrentWeather";
import DailySummary from "./components/DailySummary";
import Forecast from "./components/Forecast";
import Settings from "./components/Settings";
import ErrorBoundary from "./components/ErrorBoundary";
// import WeatherDashboard from "./components/WeatherDashboard";
import { CityProvider } from "./CityContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <CityProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg">
              <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold">
                  Weather Monitoring System
                </h1>
              </div>
            </header>

            <nav className="bg-white dark:bg-gray-800 shadow-md">
              <div className="container mx-auto px-4">
                <ul className="flex flex-wrap justify-start space-x-4 py-4">
                  {/* <NavItem to="/dashboard" end>Weather Dashboard</NavItem> */}
                  <NavItem to="/" end>
                    Current Weather
                  </NavItem>
                  <NavItem to="/summary">Daily Summary</NavItem>
                  <NavItem to="/forecast">5-Day Forecast</NavItem>
                  <NavItem to="/settings">Settings</NavItem>
                </ul>
              </div>
            </nav>

            <main className="container mx-auto px-4 py-8 flex-grow">
              <Routes>
                {/* <Route path="/dashboard" element={<WeatherDashboard />} /> */}
                <Route path="/" element={<CurrentWeather />} />
                <Route path="/summary" element={<DailySummary />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>

            <footer className="bg-gray-200 dark:bg-gray-800 text-center py-4">
              <p className="text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Weather Monitoring System. All
                rights reserved.
              </p>
            </footer>
            <ToastContainer />
          </div>
        </Router>
      </ErrorBoundary>
    </CityProvider>
  );
}

function NavItem({ to, children, end }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? "text-blue-600 dark:text-blue-400 font-semibold"
            : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        }
        end={end}
      >
        {children}
      </NavLink>
    </li>
  );
}
