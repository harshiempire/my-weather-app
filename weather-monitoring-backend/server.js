// server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server after connecting to the database
mongoose.connection.once("open", async () => {
  // Start server
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Schedule cron jobs
    const scheduleJobs = require("./services/cronJobs");
    scheduleJobs();

    // Fetch data immediately upon server startup
    const { fetchWeatherData, fetchForecastData } = require("./services/dataFetcher");
    await fetchWeatherData();
    await fetchForecastData();
  });
});