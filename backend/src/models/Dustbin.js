const mongoose = require("mongoose");

const dustbinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "empty",
        "half",
        "full",
        "overflowing",
        "in_construction",
      ],
      default: "empty",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

dustbinSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Dustbin", dustbinSchema);
