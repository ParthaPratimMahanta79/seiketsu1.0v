const Dustbin = require("../models/Dustbin");

// =============================
// GET ALL DUSTBINS (NEW)
// =============================
// GET ALL DUSTBINS (PUBLIC)
exports.getAllDustbins = async (req, res) => {
  try {
    const dustbins = await Dustbin.find();
    res.json(dustbins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =============================
// CREATE DUSTBIN
// =============================
exports.createDustbin = async (req, res, next) => {
  try {
    const { name, latitude, longitude, status } = req.body;

    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Name, latitude and longitude are required",
      });
    }

    const dustbin = await Dustbin.create({
      name,
      status,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    res.status(201).json({
      message: "Dustbin created successfully",
      dustbin,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// GET NEARBY DUSTBINS
// =============================
exports.getNearbyDustbins = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const dustbins = await Dustbin.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 2000,
        },
      },
    });

    res.json({
      count: dustbins.length,
      dustbins,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
// REPORT OVERFLOW
// =============================
exports.reportOverflow = async (req, res) => {
  try {
    const { id } = req.params;

    const dustbin = await Dustbin.findByIdAndUpdate(
      id,
      { status: "overflowing" }, // FIXED ENUM
      { new: true }
    );

    if (!dustbin) {
      return res.status(404).json({ message: "Dustbin not found" });
    }

    res.json({
      message: "Overflow reported successfully 🚨",
      dustbin,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
