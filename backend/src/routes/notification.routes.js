const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getMyNotifications,
  markAsRead,
} = require("../controllers/notification.controller");
const auth = require("../middleware/auth.middleware");

// 🔔 Get my notifications
router.get("/", authMiddleware, getMyNotifications);

// ✅ Mark notification as read
router.patch("/:id/read", authMiddleware, markAsRead);

module.exports = router;
