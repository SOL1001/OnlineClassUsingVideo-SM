const Material = require("../models/Material");
const path = require("path");
const fs = require("fs");
// Upload material (documents & videos)
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { title, description } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Determine file type
    const fileType = req.file.mimetype.startsWith("video/")
      ? "video"
      : "document";

    const material = new Material({
      title,
      description,
      fileType,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      },
      uploadedBy: req.user._id,
    });

    await material.save();
    res.status(201).json({
      success: true,
      message: "Material uploaded successfully",
      data: material,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading material",
      error: error.message,
    });
  }
};

// Get materials uploaded by a teacher
exports.getTeacherMaterials = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const materials = await Material.find({ uploadedBy: req.user._id });
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving materials",
      error: error.message,
    });
  }
};
exports.deleteMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    const userId = req.user._id;

    // Find the material
    const material = await Material.findById(materialId);
    if (!material) {
      return res
        .status(404)
        .json({ success: false, message: "Material not found" });
    }

    // Ensure only the uploader (teacher) can delete
    if (material.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this material",
      });
    }

    // Delete the file from the server
    const filePath = path.join(__dirname, "../", material.file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from the database
    await Material.findByIdAndDelete(materialId);

    res
      .status(200)
      .json({ success: true, message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting material",
      error: error.message,
    });
  }
};

// Get materials for students (documents & videos)
exports.getStudentMaterials = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const materials = await Material.find().populate("uploadedBy", "username");
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving materials",
      error: error.message,
    });
  }
};
