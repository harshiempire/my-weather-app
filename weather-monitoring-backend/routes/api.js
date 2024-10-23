const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// const auth = require('../middleware/auth');

router.get('/weather/current', weatherController.getCurrentWeather);
router.get('/weather/summary', weatherController.getDailySummary);
router.get('/weather/forecast', weatherController.getForecast);


module.exports = router;
