const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected ? "CampusFind API is healthy." : "MongoDB is not connected.",
    database: databaseConnected ? "connected" : "disconnected",
  });
});

module.exports = router;
