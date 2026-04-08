const Notification = require("../models/Notification");

// 📥 Get my notifications
exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

const mongoose = require("mongoose");

exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  // 🚨 HARD SAFETY CHECK
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid notification ID",
    });
  }

  const notification = await Notification.findById(id);

  if (!notification) {
    return res.status(404).json({
      message: "Notification not found",
    });
  }

  // 🔐 Optional: ownership check
  if (notification.user.toString() !== req.user.id) {
    return res.status(403).json({
      message: "Not allowed",
    });
  }

  notification.read = true;
  await notification.save();

  res.json({ message: "Notification marked as read" });
};

