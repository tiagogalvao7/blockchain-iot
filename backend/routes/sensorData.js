const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");
const hash = require("../utils/hashUtils");

// GET - Retrieve all measures
router.get("/", async (req, res) => {
  try {
    const measures = await SensorData.find();
    res.json(measures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// curl -X POST -H "Content-Type: application/json" -d '{"humidity": 65, "temperature": 22.5}' http://localhost:4000/api/sensor-data
// POST - Store humidity and temperature
router.post("/", async (req, res) => {
  try {
    // 1. Create and store data in DB
    const newMeasure = new SensorData({
      temperature: req.body.temperature,
      humidity: req.body.humidity,
    });

    const saved = await newMeasure.save();

    // 2. Generate hash
    const hashValue = hash.generateHash(
      saved._id.toString(),
      saved.createdAt.toISOString(),
      saved.temperature,
      saved.humidity
    );

    // 3. Sava hash in
    saved.hash = hashValue;
    await saved.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Average returns of humidity and temperature
router.get("/stats", async (req, res) => {
  try {
    const stats = await SensorData.aggregate([
      {
        $group: {
          _id: null,
          avgTemp: { $avg: "$temperature" },
          avgHumidity: { $avg: "$humidity" },
        },
      },
    ]);
    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
