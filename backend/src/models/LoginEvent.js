const mongoose = require("mongoose");

const loginEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // createdAt = the login timestamp
);

loginEventSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("LoginEvent", loginEventSchema);