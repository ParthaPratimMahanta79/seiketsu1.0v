const express = require("express");
const router = express.Router();

router.post("/predict", async (req, res) => {
  try {
    // TEMP response (test first)
    res.json({ prediction: "test success" });
  } catch (err) {
    res.status(500).json({ error: "ML prediction failed" });
  }
});

module.exports = router;