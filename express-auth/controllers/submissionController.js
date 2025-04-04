const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const User = require("../models/User");

// Get all submissions for a teacher
exports.getTeacherSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("assignment", "title description dueDate maxScore")
      .populate("student", "username email")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
      error: error.message,
    });
  }
};

// Get submissions for a specific assignment
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignment: req.params.assignmentId,
    })
      .populate("student", "username email")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
      error: error.message,
    });
  }
};

// Get student's submissions
exports.getStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate("assignment", "title description dueDate maxScore")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
      error: error.message,
    });
  }
};

// Submit an assignment
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.user._id,
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this assignment",
      });
    }

    const submissionData = {
      assignment: req.params.assignmentId,
      student: req.user._id,
      submittedAt: new Date(),
    };

    if (req.file) {
      submissionData.file = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };
    }

    const submission = await Submission.create(submissionData);

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting assignment",
      error: error.message,
    });
  }
};

// Grade a submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findById(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    // Check if user is the teacher who created the assignment
    const assignment = await Assignment.findById(submission.assignment);
    if (assignment.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to grade this submission",
      });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = "graded";
    await submission.save();

    res.json({
      success: true,
      message: "Submission graded successfully",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error grading submission",
      error: error.message,
    });
  }
};
