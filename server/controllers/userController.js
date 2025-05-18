const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const fs = require("fs");
const path = require("path");
// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || "student",
    });
    await user.save();

    // Return user data without password
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userData,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Return complete user data and token
    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          avatar: user.avatar,
          email: user.email,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          submissions: user.submissions || [],
          assignments: user.assignments || [],
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Get teacher information
exports.getTeacherInfo = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select("-password");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (teacher.role !== "teacher") {
      return res.status(400).json({
        success: false,
        message: "User is not a teacher",
      });
    }

    // Get teacher's assignments
    const assignments = await Assignment.find({ creator: teacher._id })
      .populate("creator", "username email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: {
        teacher: {
          _id: teacher._id,
          username: teacher.username,
          email: teacher.email,
          role: teacher.role,
          createdAt: teacher.createdAt,
        },
        assignments: assignments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teacher information",
      error: error.message,
    });
  }
};

// Get student information
exports.getStudentInfo = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "User is not a student",
      });
    }

    // Get student's submissions
    const submissions = await Submission.find({ student: student._id })
      .populate("assignment", "title description dueDate maxScore")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      data: {
        student: {
          _id: student._id,
          username: student.username,
          email: student.email,
          role: student.role,
          createdAt: student.createdAt,
        },
        submissions: submissions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student information",
      error: error.message,
    });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-password")
      .sort("-createdAt");

    const teacherIds = teachers.map((teacher) => teacher._id);

    // Aggregate assignment and submission counts in a single query
    const assignmentsStats = await Assignment.aggregate([
      { $match: { creator: { $in: teacherIds } } },
      { $group: { _id: "$creator", count: { $sum: 1 } } },
    ]);

    const submissionsStats = await Submission.aggregate([
      {
        $lookup: {
          from: "assignments",
          localField: "assignment",
          foreignField: "_id",
          as: "assignmentData",
        },
      },
      { $unwind: "$assignmentData" },
      { $match: { "assignmentData.creator": { $in: teacherIds } } },
      { $group: { _id: "$assignmentData.creator", count: { $sum: 1 } } },
    ]);

    // Map stats back to teachers
    const teachersWithStats = teachers.map((teacher) => {
      const assignmentsCount =
        assignmentsStats.find((stat) => stat._id.equals(teacher._id))?.count ||
        0;
      const submissionsCount =
        submissionsStats.find((stat) => stat._id.equals(teacher._id))?.count ||
        0;

      return {
        ...teacher.toObject(),
        stats: { assignmentsCount, submissionsCount },
      };
    });

    res.status(200).json({
      success: true,
      count: teachersWithStats.length,
      data: teachersWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teachers information",
      error: error.message,
    });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort("-createdAt");

    // Get submissions count for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const submissionsCount = await Submission.countDocuments({
          student: student._id,
        });
        const gradedSubmissionsCount = await Submission.countDocuments({
          student: student._id,
          grade: { $exists: true },
        });

        return {
          ...student.toObject(),
          stats: {
            submissionsCount,
            gradedSubmissionsCount,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: studentsWithStats.length,
      data: studentsWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching students information",
      error: error.message,
    });
  }
};
// Delete user by ID (admin only)
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user ID format" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        id: deletedUser._id,
        username: deletedUser.username,
        email: deletedUser.email,
        role: deletedUser.role,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const imgData = fs.readFileSync(req.file.path);
    user.avatar = {
      data: imgData,
      contentType: req.file.mimetype,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar updated and stored in DB",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update avatar",
      error: error.message,
    });
  }
};
// exports.updateAvatar = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded" });
//     }

//     const userId = req.user._id;

//     const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${
//       req.file.filename
//     }`;

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { avatar: avatarUrl },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Avatar updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update avatar",
//       error: error.message,
//     });
//   }
// };

// controllers/userController.js
exports.getMyAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // or use req.params.id
    if (!user || !user.avatar || !user.avatar.data) {
      return res.status(404).send("Avatar not found");
    }

    res.set("Content-Type", user.avatar.contentType);
    res.send(user.avatar.data);
  } catch (error) {
    res.status(500).send("Error fetching avatar");
  }
};

// exports.getMyAvatar = async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user.avatar) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Avatar not set" });
//     }

//     const avatarUrl = `${req.protocol}://${req.get("host")}${user.avatar}`;

//     res
//       .status(200)
//       .json({ success: true, avatar: avatarUrl, username: user.username });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching avatar",
//       error: error.message,
//     });
//   }
// };
