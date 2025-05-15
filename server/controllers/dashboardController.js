const User = require("../models/User");

const getTeacherDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const activeUsers = await User.countDocuments({ status: "active" });

    const recentStudents = await User.find({ role: "student" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("username email createdAt");

    const recentLogins = await User.find({ role: "student" })
      .sort({ lastLogin: -1 })
      .limit(5)
      .select("username email lastLogin");

    res.status(200).json({
      totalStudents,
      totalTeachers,
      activeUsers,
      recentStudents,
      recentLogins,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getTeacherDashboard,
};
