const DustbinRequest = require("../models/DustbinRequest");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.createDustbinRequest = async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;

    const request = await DustbinRequest.create({
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      message,
      reportedBy: req.user.id, // from JWT
    });

    // 🔔 NOTIFICATION LOGIC (inside async function)
    const admins = await User.find({ role: "admin" });

    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "New Dustbin Request",
        message: "A new dustbin request has been submitted",
        type: "request",
      });
    }

    res.status(201).json({
      message: "Dustbin request submitted successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
