const Grade = require("../models/Grade");
const User = require("../models/User");

// POST: Add grade (teacher only)
exports.submitGrade = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const studentId = req.query.studentId;
    const { subject, assignmentScore, midExamScore, finalExamScore, feedback } = req.body;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "studentId is required in query" });
    }

    if (assignmentScore > 25 || midExamScore > 25 || finalExamScore > 50) {
      return res.status(400).json({ success: false, message: "Score exceeds maximum limits" });
    }

    // Optional: Prevent duplicate submission from the same teacher for the same subject
    const existing = await Grade.findOne({
      student: studentId,
      teacher: req.user._id,
      subject: subject,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already submitted a grade for this student and subject.",
      });
    }

    const grade = await Grade.create({
      subject,
      student: studentId,
      teacher: req.user._id,
      assignmentScore,
      midExamScore,
      finalExamScore,
      feedback,
    });

    res.status(201).json({
      success: true,
      message: "Grade submitted successfully",
      data: grade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting grade",
      error: error.message,
    });
  }
};

// GET: Teacher view all submitted grades
exports.getTeacherGrades = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const grades = await Grade.find({ teacher: req.user._id }).populate(
      "student",
      "username email"
    );

    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving grades",
      error: error.message,
    });
  }
};

// GET: Student view own grade
exports.getStudentGrades = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const grades = await Grade.find({ student: req.user._id }).populate(
      "teacher",
      "username email"
    );

    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving your grade",
      error: error.message,
    });
  }
};
