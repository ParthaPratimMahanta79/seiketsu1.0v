const DustbinRequest = require("../models/DustbinRequest");
const Dustbin = require("../models/Dustbin");

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await DustbinRequest.find({ status: "pending" })
      .populate("reportedBy", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const request = await DustbinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: `Request already ${request.status}`,
      });
    }

    // ✅ Create dustbin as IN CONSTRUCTION
    const dustbin = await Dustbin.create({
      name: "New Dustbin (Under Construction)",
      status: "in_construction",
      location: request.location,
    });

    request.status = "approved";
    await request.save();

    res.json({
      message: "Request approved & dustbin created",
      dustbin,
      request,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await DustbinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      message: "Request rejected successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
