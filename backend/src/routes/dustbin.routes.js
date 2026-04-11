const express = require("express");
const router = express.Router();

const {
  getAllDustbins,   // NEW
  createDustbin,
  getNearbyDustbins,
  reportOverflow,
} = require("../controllers/dustbin.controller");

const authMiddleware = require("../middleware/auth.middleware");

// 🌍 GET ALL DUSTBINS (PUBLIC)
router.get("/", getAllDustbins);

// 🔐 Create dustbin (protected)
router.post("/", authMiddleware, createDustbin);

// 🌍 Find nearby dustbins
router.get("/near", getNearbyDustbins);

// 🚨 Report overflow
router.patch("/:id/report", authMiddleware, reportOverflow);

module.exports = router;
