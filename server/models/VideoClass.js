const mongoose = require("mongoose");

const videoClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    schedule: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VideoClass", videoClassSchema);
