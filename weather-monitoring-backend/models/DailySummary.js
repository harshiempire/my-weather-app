const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
  city: String,
  date: String, // YYYY-MM-DD
  temperatures: [Number],
  conditions: [String],
  humidity: [Number],
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  avgHumidity: Number,
  dominantCondition: String,
  summary: String, // Added summary field

});

module.exports = mongoose.model('DailySummary', DailySummarySchema);