const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignmentScore: {
      type: Number,
      required: true,
      max: 25,
    },
    midExamScore: {
      type: Number,
      required: true,
      max: 25,
    },
    finalExamScore: {
      type: Number,
      required: true,
      max: 50,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Grade", gradeSchema);
