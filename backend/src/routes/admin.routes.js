const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getAllRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/admin.controller");

// 🔐 Admin only
router.get("/requests", authMiddleware, adminMiddleware, getAllRequests);
router.patch(
  "/requests/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveRequest
);
router.patch(
  "/requests/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectRequest
);


module.exports = router;
