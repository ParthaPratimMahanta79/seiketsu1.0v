const express = require("express");
const router = express.Router();

const {
  createDustbinRequest,
} = require("../controllers/dustbinRequest.controller");

const authMiddleware = require("../middleware/auth.middleware");

// 🔐 User requests a new dustbin
router.post("/", authMiddleware, createDustbinRequest);

module.exports = router;
