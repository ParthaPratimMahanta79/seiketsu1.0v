const NavigationEvent = require("../models/NavigationEvent");

/* START NAVIGATION: logged when a route to a bin is found */
exports.startNavigation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { binName } = req.body;

    const event = await NavigationEvent.create({
      userId,
      binName: binName || null,
    });

    res.status(201).json({ eventId: event._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* COMPLETE NAVIGATION: logged when the user taps "I've Arrived" */
exports.completeNavigation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const event = await NavigationEvent.findOneAndUpdate(
      { _id: eventId, userId },
      { completed: true, completedAt: new Date() },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Navigation event not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};