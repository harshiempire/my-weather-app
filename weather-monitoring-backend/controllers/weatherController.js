
const WeatherData = require('../models/WeatherData');
const DailySummary = require('../models/DailySummary');
const ForecastData = require('../models/ForecastData');

// Function to get current weather
exports.getCurrentWeather = async (req, res) => {
    const city = req.query.city;
    try {
      let data;
      if (city) {
        data = await WeatherData.findOne({ city }).sort({ dt: -1 });
        if (data) {
          res.json({
            city: data.city,
            main: data.main,
            temp: data.temp,
            feels_like: data.feels_like,
            humidity: data.humidity,
            dt: data.dt,
          });
        } else {
          res.status(404).json({ message: 'No data found for the selected city.' });
        }
      } else {
        // Return data for all cities if no city is specified
        data = await WeatherData.aggregate([
          {
            $sort: { dt: -1 },
          },
          {
            $group: {
              _id: '$city',
              city: { $first: '$city' },
              main: { $first: '$main' },
              temp: { $first: '$temp' },
              feels_like: { $first: '$feels_like' },
              humidity: { $first: '$humidity' },
              dt: { $first: '$dt' },
            },
          },
          {
            $project: {
              _id: 0,
              city: 1,
              main: 1,
              temp: 1,
              feels_like: 1,
              humidity: 1,
              dt: 1,
            },
          },
        ]);
        res.json(data);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Get daily summaries
// controllers/weatherController.js

exports.getDailySummary = async (req, res) => {
    const city = req.query.city;
    try {
      const query = city ? { city } : {};
      const summaries = await DailySummary.find(query);
      res.json(summaries);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


exports.getForecast = async (req, res) => {
    const city = req.query.city;
    try {
      if (!city) {
        return res.status(400).json({ message: 'City parameter is required.' });
      }
  
      const forecast = await ForecastData.findOne({ city }).sort({ fetchedAt: -1 });
  
      if (!forecast) {
        return res.status(404).json({ message: 'No forecast data found for the selected city.' });
      }
  
      res.json(forecast.forecastList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

