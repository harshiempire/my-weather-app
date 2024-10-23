const mongoose = require('mongoose');

const WeatherDataSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    index: true, // Index on city
  },
  main: String,
  temp: Number,
  feels_like: Number,
  humidity: Number,
  dt: {
    type: Date,
    required: true,
    index: true, // Index on dt
  },
});

WeatherDataSchema.index({ city: 1, dt: -1 });

module.exports = mongoose.model('WeatherData', WeatherDataSchema);