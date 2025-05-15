const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileType: { type: String, required: true }, // "document" or "video"
  file: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Material", MaterialSchema);
