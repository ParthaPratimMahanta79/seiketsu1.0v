const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

// ✅ simple protected test route
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Protected user route works ✅",
    user: req.user,
  });
});

module.exports = router;
