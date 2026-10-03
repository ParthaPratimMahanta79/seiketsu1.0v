const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/auth.middleware");

const User = require("../models/User");
const DustbinRequest = require("../models/DustbinRequest");
const LoginEvent = require("../models/LoginEvent");
const NavigationEvent = require("../models/NavigationEvent");

const PYTHON_ML_URL = "https://seiketsu1-0v.onrender.com/predict";

/**
 * POST /api/ml/predict
 * Features are computed HERE from the logged-in user's real data, never
 * taken from the request body, so users can't fake their own score.
 * verified_disposals is not used: nothing in the app can back it.
 */
router.post("/predict", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      reportsSent,
      reportsApproved,
      reportsRejected,
      recentActivity,
      loginFrequency,
      binsNavigated,
      successfulRoutes,
    ] = await Promise.all([
      DustbinRequest.countDocuments({ reportedBy: userId }),
      DustbinRequest.countDocuments({ reportedBy: userId, status: "approved" }),
      DustbinRequest.countDocuments({ reportedBy: userId, status: "rejected" }),
      DustbinRequest.countDocuments({ reportedBy: userId, createdAt: { $gte: sevenDaysAgo } }),
      LoginEvent.countDocuments({ userId }),
      NavigationEvent.countDocuments({ userId }),
      NavigationEvent.countDocuments({ userId, completed: true }),
    ]);

    const activeDays = Math.max(
      0,
      Math.floor((Date.now() - user.createdAt.getTime()) / (24 * 60 * 60 * 1000))
    );

    const features = {
      requests_made: reportsSent,
      bins_navigated: binsNavigated,
      reports_sent: reportsSent,
      reports_approved: reportsApproved,
      reports_rejected: reportsRejected,
      leaderboard_score: reportsApproved * 5, // matches getTopContributors scoring
      successful_routes: successfulRoutes,
      active_days: activeDays,
      recent_activity: recentActivity,
      login_frequency: loginFrequency,
      navigation_frequency: binsNavigated,
      reporting_frequency: reportsSent,
    };

    const mlResponse = await axios.post(PYTHON_ML_URL, features);

    res.json({
      engagement: mlResponse.data.engagement,
      confidence: mlResponse.data.confidence,
    });
  } catch (err) {
    console.error("ML prediction failed:", err.message);
    res.status(500).json({ error: "ML prediction failed" });
  }
});

module.exports = router;