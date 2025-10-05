const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
  {
    temperature: Number,
    humidity: Number,
    hash: { type: String },
    sentToBlockchain: { type: Boolean, default: false },
    txHash: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);
