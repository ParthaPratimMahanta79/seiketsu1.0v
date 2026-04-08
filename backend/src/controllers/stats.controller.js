const DustbinRequest = require("../models/DustbinRequest");
const Dustbin = require("../models/Dustbin");

/* =====================================
   🏆 TOP CONTRIBUTORS
===================================== */
exports.getTopContributors = async (req, res) => {
  try {
    const stats = await DustbinRequest.aggregate([
      { $match: { status: "approved" } },

      {
        $group: {
          _id: "$reportedBy",
          approvedCount: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$user" },

      // 🚀 EXCLUDE ADMINS HERE
      { $match: { "user.role": { $ne: "admin" } } },

      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          approvedRequests: "$approvedCount",
          score: { $multiply: ["$approvedCount", 5] },
        },
      },

      { $sort: { score: -1 } },
      { $limit: 10 },
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================
   📍 AREA STATS (7A)
===================================== */
exports.getAreaStats = async (req, res) => {
  try {
    const { lat, lng, radius = 2000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "lat and lng are required",
      });
    }

    const results = await DustbinRequest.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: "distance",
          maxDistance: Number(radius),
          spherical: true,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================
   🔥 AREA HEATMAP (7B)
===================================== */
exports.getAreaHeatMap = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "lat and lng are required",
      });
    }

    const data = await DustbinRequest.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: "distance",
          maxDistance: Number(radius),
          spherical: true,
        },
      },
      {
        $group: {
          _id: {
            lat: { $arrayElemAt: ["$location.coordinates", 1] },
            lng: { $arrayElemAt: ["$location.coordinates", 0] },
          },
          totalReports: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          lat: "$_id.lat",
          lng: "$_id.lng",
          totalReports: 1,
        },
      },
      { $sort: { totalReports: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =====================================
   👤 MY STATS (Dashboard Cards)
===================================== */
exports.getMyStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count approved, pending requests for this user
    const [approved, pending] = await Promise.all([
      DustbinRequest.countDocuments({ reportedBy: userId, status: "approved" }),
      DustbinRequest.countDocuments({ reportedBy: userId, status: "pending" }),
    ]);

    // Count overflow reports by this user (dustbins currently overflowing)
    const overflowReports = await Dustbin.countDocuments({ status: "overflowing" });

    // Calculate rank: how many non-admin users have MORE approved requests than this user
    const allUserStats = await DustbinRequest.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$reportedBy", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.role": { $ne: "admin" } } },
      { $sort: { count: -1 } },
    ]);

    const rankIndex = allUserStats.findIndex(
      (s) => s._id.toString() === userId.toString()
    );
    const rank = rankIndex === -1 ? "—" : `#${rankIndex + 1}`;

    res.json({ approved, pending, overflowReports, rank });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};