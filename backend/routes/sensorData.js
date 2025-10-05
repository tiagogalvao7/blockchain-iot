const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");
const hash = require("../utils/hashUtils");
const { storeDataOnChain, storeBatchData } = require("../blockchain");

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

    // 3. Save hash in database
    saved.hash = hashValue;
    await saved.save();

    // 4. Check if exists 10 or more hashes to sent for blockchain
    const pending = await SensorData.find({ sentToBlockchain: false });

    if (pending.length >= 10) {
      // grab 10 first hashes
      const batch = pending.slice(0, 10);

      // create array of hashes
      const hashesArray = batch.map((r) => r.hash);

      try {
        // send 10 hashes in one transaction
        const tx = await storeBatchData(hashesArray);

        // check each hash with sent
        for (let record of batch) {
          record.sentToBlockchain = true;
          record.txHash = tx.hash;
          await record.save();
        }
      } catch (err) {
        console.error("Erro ao enviar batch:", err);
      }
    }

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

// GET - data + etherscan link
router.get("/with-etherscan", async (req, res) => {
  try {
    const baseUrl = `https://sepolia.etherscan.io/tx/`;
    const data = await SensorData.find().lean();
    const enriched = data.map((item) => ({
      ...item,
      etherscanLink: item.txHash ? `${baseUrl}${item.txHash}` : null,
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
