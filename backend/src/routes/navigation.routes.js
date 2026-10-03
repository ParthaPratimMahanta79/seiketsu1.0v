const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  startNavigation,
  completeNavigation,
} = require("../controllers/navigation.controller");

router.post("/start", authMiddleware, startNavigation);
router.patch("/:eventId/complete", authMiddleware, completeNavigation);

module.exports = router;