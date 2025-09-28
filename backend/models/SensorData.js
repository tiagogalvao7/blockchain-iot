const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
