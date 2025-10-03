const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  createdAt: { type: Date, default: Date.now },
  hash: { type: String },
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
