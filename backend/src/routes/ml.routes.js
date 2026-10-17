const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/auth.middleware");

const User = require("../models/User");
const DustbinRequest = require("../models/DustbinRequest");
const LoginEvent = require("../models/LoginEvent");
const NavigationEvent = require("../models/NavigationEvent");

const PYTHON_BASE_URL = "https://seiketsu1-0v.onrender.com";

/**
 * Render's free tier puts the Python service to sleep after ~15 min idle,
 * and waking it takes 30-60s. During that window Render's proxy answers
 * 502/503/504 (or the connection times out). We retry those a few times
 * instead of failing on the first attempt.
 */
async function callPython(features) {
  const attempts = 3;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await axios.post(`${PYTHON_BASE_URL}/predict`, features, {
        timeout: 28000,
      });
    } catch (err) {
      const status = err.response?.status;
      const retriable = !status || status === 502 || status === 503 || status === 504;
      console.error(
        `Python call attempt ${i}/${attempts} failed:`,
        status || err.code || err.message
      );
      if (!retriable || i === attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

/**
 * GET /api/ml/warmup
 * Called by the frontend as soon as the app loads. Wakes the Python service
 * in the background and answers immediately. No auth needed: it exposes no
 * data. Throttled so it can't be used to hammer the Python service.
 */
let lastWarmup = 0;
router.get("/warmup", (req, res) => {
  const now = Date.now();
  if (now - lastWarmup > 4 * 60 * 1000) {
    lastWarmup = now;
    axios
      .get(`${PYTHON_BASE_URL}/health`, { timeout: 90000 })
      .catch((err) => console.error("Warm-up ping failed:", err.message));
  }
  res.json({ status: "warming" });
});

/**
 * POST /api/ml/predict
 * Features are computed HERE from the logged-in user's real data, never
 * taken from the request body, so users can't fake their own score.
 * verified_disposals is not used: nothing in the app can back it.
 *
 * reports_sent = requests that received a decision (approved + rejected).
 * This matches the training data, where every report had an outcome, so
 * pending requests don't drag approval_rate down.
 * requests_made / reporting_frequency = everything the user submitted.
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
      totalSubmitted,
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

    const reportsDecided = reportsApproved + reportsRejected;

    const activeDays = Math.max(
      0,
      Math.floor((Date.now() - user.createdAt.getTime()) / (24 * 60 * 60 * 1000))
    );

    const features = {
      requests_made: totalSubmitted,
      bins_navigated: binsNavigated,
      reports_sent: reportsDecided,
      reports_approved: reportsApproved,
      reports_rejected: reportsRejected,
      leaderboard_score: reportsApproved * 5, // matches getTopContributors scoring
      successful_routes: successfulRoutes,
      active_days: activeDays,
      recent_activity: recentActivity,
      login_frequency: loginFrequency,
      navigation_frequency: binsNavigated,
      reporting_frequency: totalSubmitted,
    };

    const mlResponse = await callPython(features);

    res.json({
      engagement: mlResponse.data.engagement,
      confidence: mlResponse.data.confidence, // = probability of High Engagement
    });
  } catch (err) {
    console.error(
      "ML prediction failed:",
      err.response?.status || err.code || "",
      err.message
    );
    res.status(500).json({ error: "ML prediction failed" });
  }
});

module.exports = router;