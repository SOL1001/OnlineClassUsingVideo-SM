import {
  FiFileText,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
  FiUpload,
  FiClock,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ResponseModal from "../components/ResponseModal";

type Assignment = {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  status: "pending" | "submitted" | "late" | "graded";
  submittedDate?: string;
  grade?: number;
  feedback?: string;
  files?: string[];
  submissionFiles?: string[];
  totalPoints: number;
};

const StudentAssignmentPage = () => {
  // Sample assignments data
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "ASG-101",
      title: "Quadratic Equations Problem Set",
      course: "Algebra Fundamentals",
      description:
        "Solve the following quadratic equations using all three methods we learned in class: factoring, completing the square, and the quadratic formula. Show all your work for full credit.",
      dueDate: "2023-07-20T23:59:00",
      status: "pending",
      files: ["problem_set.pdf", "examples.docx"],
      totalPoints: 100,
    },
    {
      id: "ASG-102",
      title: "Chemical Reactions Lab Report",
      course: "Introduction to Chemistry",
      description:
        "Write a lab report documenting your observations from the chemical reactions experiment. Include your hypothesis, methods, results, and conclusions.",
      dueDate: "2023-07-15T23:59:00",
      status: "submitted",
      submittedDate: "2023-07-14T14:30:00",
      files: ["lab_guidelines.pdf"],
      submissionFiles: ["lab_report.docx"],
      totalPoints: 100,
    },
    {
      id: "ASG-103",
      title: "Shakespeare Sonnet Analysis",
      course: "English Literature",
      description:
        "Analyze one of Shakespeare's sonnets of your choice. Discuss the themes, literary devices, and historical context in 3-5 pages.",
      dueDate: "2023-07-10T23:59:00",
      status: "graded",
      submittedDate: "2023-07-09T18:45:00",
      grade: 88,
      feedback:
        "Excellent analysis of the sonnet's themes, but could have explored the historical context more deeply. Well-organized and clearly written.",
      files: ["sonnet_analysis_rubric.pdf"],
      submissionFiles: ["sonnet_18_analysis.docx"],
      totalPoints: 100,
    },
    {
      id: "ASG-104",
      title: "Linear Algebra Exercises",
      course: "Advanced Mathematics",
      description:
        "Complete exercises 1-10 from chapter 3. Show all your work and justify each step.",
      dueDate: "2023-07-05T23:59:00",
      status: "late",
      submittedDate: "2023-07-07T09:15:00",
      grade: 65,
      feedback:
        "Several problems were incomplete. Please review matrix operations before the next assignment.",
      files: ["chapter3_problems.pdf"],
      submissionFiles: ["linear_algebra_solutions.pdf"],
      totalPoints: 100,
    },
  ]);

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const courses = [
    "All Courses",
    "Algebra Fundamentals",
    "Introduction to Chemistry",
    "English Literature",
    "Advanced Mathematics",
  ];
  const statuses = ["All Statuses", "pending", "submitted", "graded", "late"];

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" || assignment.course === selectedCourse;
    const matchesStatus =
      selectedStatus === "All Statuses" || assignment.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const submitAssignment = () => {
    if (!selectedAssignment) return;

    // In a real app, this would upload to your backend
    const updatedAssignments = assignments.map((a) =>
      a.id === selectedAssignment.id
        ? {
            ...a,
            status: new Date(a.dueDate) < new Date() ? "late" : "submitted",
            submittedDate: new Date().toISOString(),
            submissionFiles: uploadedFiles.map((f) => f.name),
          }
        : a
    );

    setAssignments(updatedAssignments);
    setSelectedAssignment(
      updatedAssignments.find((a) => a.id === selectedAssignment.id) || null
    );
    setUploadedFiles([]);
    setSubmissionText("");
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const timeLeft = date.getTime() - now.getTime();

    if (timeLeft <= 0) {
      return "Due date passed";
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0) {
      return `Due in ${days} day${days > 1 ? "s" : ""}`;
    } else {
      return `Due in ${Math.ceil(hours)} hour${hours !== 1 ? "s" : ""}`;
    }
  };
  // .......
  const [data, setData] = useState<any[]>([]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/assignments", {
        // Corrected URL
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setData(data.data);
        console.log("Assignments fetched successfully:", data);
      } else {
        console.error("Failed to fetch assignments");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const [responseModal, setResponseModal] = useState({
    open: false,
    title: "",
    message: "",
    btnConfirm: false,
    success: false,
    btnLabel2: "",
    btnLabel: "",
    onClose: () => {},
    onConfirm: () => {},
  });
  const handleResponseCloseModal = () => {
    setResponseModal({
      ...responseModal,
      open: false,
      btnConfirm: false,
      title: "",
      message: "",
      success: false,
      btnLabel: "",
    });

    // setRequestWithdrawOpen(false);
    // setUpdateOpen(false);
  };
  const [id, setId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    // formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/submissions/${id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("ddddddddddddddddddddd", result.success);
      if (result.success) {
        console.log("Assignment submitted successfully");
        fetchAssignments();

        setResponseModal({
          ...responseModal,
          open: true,
          title: "Assignments",
          message: result.message,
          btnConfirm: false,
          success: true,
          onClose: () => {
            handleResponseCloseModal();
          },
        });

        // setOpen(false);
      } else {
        setResponseModal({
          ...responseModal,
          open: true,
          btnConfirm: false,
          title: "Assignments",
          message: result.message,
          success: false,
          onClose: () => {
            handleResponseCloseModal();
          },
        });
        console.error("Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };
  return (
    <div>
      <Header title="Assignments" />
      <div className="p-6 md:mt-[68px] mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Assignments</h1>
            <p className="text-gray-600">
              View and submit your course assignments
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {assignments.filter((a) => a.status === "pending").length} Pending
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {assignments.filter((a) => a.status === "graded").length} Graded
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Assignments List */}
          <div className={`${selectedAssignment ? "lg:w-1/2" : "w-full"}`}>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Creator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.length > 0 ? (
                    data.map((assignment) => (
                      <tr
                        key={assignment._id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedAssignment?._id === assignment._id
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setId(assignment._id);
                          // setFile(null);
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {assignment.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignment.description.substring(0, 50)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.creator.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`flex items-center ${
                              new Date(assignment.dueDate) < new Date() &&
                              assignment.status !== "graded"
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {new Date(assignment.dueDate) < new Date() &&
                              assignment.status !== "graded" && (
                                <FiAlertCircle className="mr-1" />
                              )}
                            <div>
                              <div className="text-sm">
                                {new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDueDate(assignment.dueDate)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              assignment.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {assignment.status.charAt(0).toUpperCase() +
                              assignment.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No assignments found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assignment Detail View */}
          {selectedAssignment && (
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedAssignment.title}
                    </h2>
                    <p className="text-gray-600">{selectedAssignment.course}</p>
                  </div>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                      selectedAssignment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedAssignment.status === "submitted"
                        ? "bg-blue-100 text-blue-800"
                        : selectedAssignment.status === "late"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedAssignment.status.charAt(0).toUpperCase() +
                      selectedAssignment.status.slice(1)}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedAssignment.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Due Date</h3>
                  <div
                    className={`flex items-center ${
                      new Date(selectedAssignment.dueDate) < new Date() &&
                      selectedAssignment.status !== "graded"
                        ? "text-red-600"
                        : "text-gray-700"
                    }`}
                  >
                    <FiCalendar className="mr-2" />
                    <div>
                      <div>
                        {new Date(selectedAssignment.dueDate).toLocaleString(
                          [],
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                      <div className="text-sm">
                        {formatDueDate(selectedAssignment.dueDate)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment Files */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Assignment Files</h3>
                  <a
                    href={`http://localhost:5000/${selectedAssignment.file.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                    title="Download File"
                  >
                    Download
                  </a>
                  <div className="space-y-2">
                    {selectedAssignment.files?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <FiFileText className="text-gray-500 mr-2" />
                          <span>{file}</span>
                        </div>
                        <button className="text-blue-500 hover:text-blue-700">
                          <FiDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submission Section */}
                {selectedAssignment.status === "graded" ||
                selectedAssignment.status === "late" ? (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Your Submission</h3>
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span>Submitted on:</span>
                        <span className="font-medium">
                          {selectedAssignment.submittedDate &&
                            new Date(
                              selectedAssignment.submittedDate
                            ).toLocaleString()}
                        </span>
                      </div>
                      {selectedAssignment.submissionFiles?.map(
                        (file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2"
                          >
                            <div className="flex items-center">
                              <FiFileText className="text-gray-500 mr-2" />
                              <span>{file}</span>
                            </div>
                            <button className="text-blue-500 hover:text-blue-700">
                              <FiDownload />
                            </button>
                          </div>
                        )
                      )}
                    </div>

                    {selectedAssignment.grade && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span>Grade:</span>
                          <span className="font-medium">
                            {selectedAssignment.grade}/
                            {selectedAssignment.totalPoints} (
                            {Math.round(
                              (selectedAssignment.grade /
                                selectedAssignment.totalPoints) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedAssignment.feedback && (
                      <div>
                        <h4 className="font-medium mb-1">
                          Instructor Feedback
                        </h4>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-line">
                            {selectedAssignment.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : selectedAssignment.status === "submitted" ? (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Your Submission</h3>
                    <div className="flex items-center text-green-600 mb-2">
                      <FiCheckCircle className="mr-2" />
                      <span>Submitted for grading</span>
                    </div>
                    <div className="mb-1">
                      <span>Submitted on: </span>
                      <span className="font-medium">
                        {selectedAssignment.submittedDate &&
                          new Date(
                            selectedAssignment.submittedDate
                          ).toLocaleString()}
                      </span>
                    </div>
                    {selectedAssignment.submissionFiles?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2"
                      >
                        <div className="flex items-center">
                          <FiFileText className="text-gray-500 mr-2" />
                          <span>{file}</span>
                        </div>
                        <button className="text-blue-500 hover:text-blue-700">
                          <FiDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Submit Assignment</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Submission (Optional)
                      </label>
                      <textarea
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder="Type your submission here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Submission
                      </label>
                      <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg border border-dashed border-blue-400 cursor-pointer hover:bg-blue-50">
                        <FiUpload className="text-2xl mb-2" />
                        <span className="text-sm">Click to upload files</span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                      {file && (
                        <div className="mt-2 text-sm text-gray-700">
                          Uploaded File:{" "}
                          <span className="font-medium">{file.name}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!file && uploadedFiles.length === 0}
                      className={`w-full py-3 rounded-lg font-medium ${
                        !file && uploadedFiles.length === 0 && !submissionText
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Submit Assignment
                    </button>

                    {new Date(selectedAssignment.dueDate) < new Date() && (
                      <div className="flex items-center text-red-600 mt-3">
                        <FiAlertCircle className="mr-2" />
                        <span>
                          This assignment is past due. Late submissions may be
                          penalized.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ResponseModal
        onClose={handleResponseCloseModal}
        onConfirm={responseModal.onConfirm}
        open={responseModal.open}
        message={responseModal.message}
        title={responseModal.title}
        btnLabel2={responseModal.btnLabel2}
        btnConfirm={responseModal.btnConfirm}
        btnLabel={responseModal.btnLabel}
        success={responseModal.success}
      />
    </div>
  );
};

export default StudentAssignmentPage;
