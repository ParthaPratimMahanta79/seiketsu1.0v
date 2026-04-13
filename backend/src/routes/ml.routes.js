const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/predict", async (req, res) => {
  try {
    const userData = req.body;

    const mlResponse = await axios.post(
      "https://seiketsu1-0v.onrender.com/predict",
      userData
    );

    res.json({
      engagement: mlResponse.data.engagement,
      confidence: mlResponse.data.confidence
    });

  } catch (err) {
    console.error("ML prediction failed:", err.message);
    res.status(500).json({ error: "ML prediction failed" });
  }
});

module.exports = router;