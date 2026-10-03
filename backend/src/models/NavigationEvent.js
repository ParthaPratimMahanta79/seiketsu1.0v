const mongoose = require("mongoose");

const navigationEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    binName: { type: String, default: null },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true } // createdAt = when navigation was started
);

navigationEventSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("NavigationEvent", navigationEventSchema);