const express = require("express");
const router = express.Router();

const {
  getTopContributors,
  getAreaStats,
  getAreaHeatMap,
  getMyStats,
} = require("../controllers/stats.controller");

const authMiddleware = require("../middleware/auth.middleware");

// 🏆 Top contributors
router.get("/top-contributors", getTopContributors);

// 📍 Area based stats (geo)
router.get("/area", getAreaStats);

// 🔥 Area heatmap data
router.get("/heatmap", getAreaHeatMap);

// 👤 My dashboard stats (protected)
router.get("/my-stats", authMiddleware, getMyStats);

module.exports = router;