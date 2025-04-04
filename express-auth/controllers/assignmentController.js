const Assignment = require("../models/Assignment");
const User = require("../models/User");

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, maxScore } = req.body;

    const assignmentData = {
      title,
      description,
      dueDate,
      maxScore,
      creator: req.user._id,
      teacherName: req.user.username,
    };

    if (req.file) {
      assignmentData.file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };
    }

    const assignment = await Assignment.create(assignmentData);

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating assignment",
      error: error.message,
    });
  }
};

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("creator", "username email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: error.message,
    });
  }
};

// Get a single assignment
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "creator",
      "username email"
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignment",
      error: error.message,
    });
  }
};

// Update an assignment
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if user is the creator or admin
    if (
      assignment.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this assignment",
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("creator", "username email");

    res.json({
      success: true,
      message: "Assignment updated successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating assignment",
      error: error.message,
    });
  }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if user is the creator or admin
    if (
      assignment.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this assignment",
      });
    }

    await assignment.deleteOne();

    res.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting assignment",
      error: error.message,
    });
  }
};
