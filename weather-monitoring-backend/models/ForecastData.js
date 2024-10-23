const mongoose = require('mongoose');

const ForecastDataSchema = new mongoose.Schema({
  city: String,
  forecastList: [
    {
      dt: Date,
      temp: Number,
      feels_like: Number,
      temp_min: Number,
      temp_max: Number,
      pressure: Number,
      humidity: Number,
      main: String,
      description: String,
      icon: String,
      wind_speed: Number,
      wind_deg: Number,
      pop: Number,
      rain: Number,
      dt_txt: String,
    },
  ],
  fetchedAt: Date,
});

module.exports = mongoose.model('ForecastData', ForecastDataSchema);
