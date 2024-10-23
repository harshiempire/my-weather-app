const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
  city: String,
  date: String, // YYYY-MM-DD
  temperatures: [Number],
  conditions: [String],
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String,
});

module.exports = mongoose.model('DailySummary', DailySummarySchema);