const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const sensorDataRouter = require("./routes/sensorData");
require("dotenv").config();

const app = express();
const port = 4000;

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use(cors());

// Routes
app.use("/api/sensor-data", sensorDataRouter);

// Start server
app.listen(port, () => console.log(`REST API server running on port ${port}`));
