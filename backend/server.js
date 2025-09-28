const express = require("express");
const connectDB = require("./db");
const sensorDataRouter = require("./routes/sensorData");
require("dotenv").config();

const app = express();
const port = 4000;

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/sensor-data", sensorDataRouter);

// Start server
app.listen(port, () => console.log(`REST API server running on port ${port}`));
