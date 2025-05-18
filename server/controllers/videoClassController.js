const VideoClass = require("../models/VideoClass");

// 1. Create a video class
exports.createClass = async (req, res) => {
  try {
    const { className, course, schedule, status } = req.body;

    const videoClass = new VideoClass({
      className,
      course,
      schedule,
      status,
      teacher: req.user._id,
    });

    await videoClass.save();

    res.status(201).json({
      success: true,
      message: "Class scheduled successfully",
      data: videoClass,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to schedule class",
      error: err.message,
    });
  }
};

// 2. Get all classes created by the logged-in teacher
exports.getMyClasses = async (req, res) => {
  try {
    const classes = await VideoClass.find({ teacher: req.user._id });
    res.status(200).json({ success: true, data: classes });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve classes",
      error: err.message,
    });
  }
};

// 3. Get all classes (for students)
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await VideoClass.find().populate(
      "teacher",
      "username email"
    );
    res.status(200).json({ success: true, data: classes });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: err.message,
    });
  }
};
