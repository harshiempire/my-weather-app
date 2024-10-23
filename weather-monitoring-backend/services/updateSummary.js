// services/updateSummary.js

const DailySummary = require("../models/DailySummary");

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You will the daily summary of the weather in the form of a json and you have to generate a summary and return the json with the new summary field also try to ans why is it so in that place\n\n{\n  _id: new ObjectId('6718821a560e008def4d4a36'),\n  city: 'Hyderabad',\n  date: '2024-10-23',\n  temperatures: [\n    28.23, 28.23, 28.23, 28.23,\n    28.23, 29.73, 29.73, 29.73,\n    29.21, 29.23, 29.23, 29.23,\n    29.23, 29.23, 29.23, 29.23,\n    30.23, 24.48, 24.48, 24.48,\n    24.48, 24.48, 24.48\n  ],\n  conditions: [\n    'Haze',   'Haze',   'Haze',\n    'Haze',   'Haze',   'Mist',\n    'Mist',   'Mist',   'Haze',\n    'Haze',   'Haze',   'Haze',\n    'Haze',   'Haze',   'Haze',\n    'Haze',   'Haze',   'Clouds',\n    'Clouds', 'Clouds', 'Clouds',\n    'Clouds', 'Clouds'\n  ],\n  avgTemp: 27.881304347826095,\n  maxTemp: 30.23,\n  minTemp: 24.48,\n  dominantCondition: 'Haze',\n  __v: 22\n}\n\nthis is the example json there are multiple days return json in the valid format \n\nreturn me a json in the format of \n\n{\n\"summary\":\n}  keep the summary short DON'T MAKE THE SUMMARIES TOO LONG",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function run(summary) {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "{\n  _id: new ObjectId('6718821a560e008def4d4a36'),\n  city: 'Hyderabad',\n  date: '2024-10-23',\n  temperatures: [\n    28.23, 28.23, 28.23, 28.23,\n    28.23, 29.73, 29.73, 29.73,\n    29.21, 29.23, 29.23, 29.23,\n    29.23, 29.23, 29.23, 29.23,\n    30.23, 24.48, 24.48, 24.48,\n    24.48, 24.48, 24.48\n  ],\n  conditions: [\n    'Haze',   'Haze',   'Haze',\n    'Haze',   'Haze',   'Mist',\n    'Mist',   'Mist',   'Haze',\n    'Haze',   'Haze',   'Haze',\n    'Haze',   'Haze',   'Haze',\n    'Haze',   'Haze',   'Clouds',\n    'Clouds', 'Clouds', 'Clouds',\n    'Clouds', 'Clouds'\n  ],\n  avgTemp: 27.881304347826095,\n  maxTemp: 30.23,\n  minTemp: 24.48,\n  dominantCondition: 'Haze',\n  __v: 22\n}"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\"summary\": \"Hyderabad experienced a mostly hazy day on 2024-10-23, with temperatures ranging from a high of 30.23 degrees Celsius to a low of 24.48 degrees Celsius. The average temperature for the day was 27.88 degrees Celsius. There were periods of mist in the morning, transitioning to cloudy conditions in the evening. The dominant condition throughout the day was haze, which is likely due to a combination of factors, including dust, pollution, and atmospheric conditions.\"}\n\n```"},
          ],
        },
      ],
    });
  

  const result = await chatSession.sendMessage(JSON.stringify(summary));
  return result.response.text();
}



async function updateDailySummary(cityName, weatherData) {
  try {
    const date = weatherData.dt.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format

    const existingSummary = await DailySummary.findOne({
      city: cityName,
      date: date,
    });

    if (existingSummary) {
      existingSummary.temperatures.push(weatherData.temp);
      existingSummary.conditions.push(weatherData.main);
      existingSummary.humidity.push(weatherData.humidity);
      existingSummary.avgTemp =
        existingSummary.temperatures.reduce((a, b) => a + b, 0) /
        existingSummary.temperatures.length;
      existingSummary.maxTemp = Math.max(...existingSummary.temperatures);
      existingSummary.minTemp = Math.min(...existingSummary.temperatures);
      existingSummary.avgHumidity =
        existingSummary.humidity.reduce((a, b) => a + b, 0) /
        existingSummary.humidity.length;
      existingSummary.dominantCondition = getDominantCondition(
        existingSummary.conditions
      );

      const summary = await run(existingSummary)
      const summaryJson = JSON.parse(summary)

      existingSummary.summary = summaryJson.summary
      
      console.log(summaryJson.summary)

      await existingSummary.save();
    } else {
      const dailySummary = new DailySummary({
        city: cityName,
        date: date,
        temperatures: [weatherData.temp],
        conditions: [weatherData.main],
        humidity: [weatherData.humidity],
        avgTemp: weatherData.temp,
        maxTemp: weatherData.temp,
        minTemp: weatherData.temp,
        avgHumidity: weatherData.humidity,
        dominantCondition: weatherData.main,
      });
      await dailySummary.save();
    }
  } catch (error) {
    console.error("Error updating daily summary:", error);
    throw error;
  }
}

// Function to get dominant weather condition
function getDominantCondition(conditions) {
  const conditionCount = {};
  conditions.forEach((condition) => {
    conditionCount[condition] = (conditionCount[condition] || 0) + 1;
  });
  return Object.keys(conditionCount).reduce((a, b) =>
    conditionCount[a] > conditionCount[b] ? a : b
  );
}

module.exports = updateDailySummary;