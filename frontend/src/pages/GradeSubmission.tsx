import {
  FiSearch,
  FiChevronDown,
  FiCheck,
  FiX,
  FiFileText,
  FiDownload,
  FiUpload,
  FiMessageSquare,
} from "react-icons/fi";
import { useState } from "react";
import Header from "../components/Header";

type Submission = {
  id: string;
  student: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  submittedAt: string;
  files: string[];
  grade?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
};

type RubricItem = {
  id: string;
  criteria: string;
  maxPoints: number;
  earnedPoints?: number;
  comments?: string;
};

const GradeSubmissionPage = () => {
  // Sample data
  const assignment = {
    id: "ASG-2023-001",
    title: "Algebra Fundamentals",
    course: "Mathematics",
    dueDate: "2023-07-15",
    totalPoints: 100,
    rubric: [
      { id: "RUB-1", criteria: "Problem Solving", maxPoints: 40 },
      { id: "RUB-2", criteria: "Accuracy", maxPoints: 30 },
      { id: "RUB-3", criteria: "Presentation", maxPoints: 20 },
      { id: "RUB-4", criteria: "Timeliness", maxPoints: 10 },
    ] as RubricItem[],
  };

  const submissions: Submission[] = [
    {
      id: "SUB-001",
      student: {
        id: "STU-001",
        name: "John Doe",
        avatar: "JD",
        email: "john@example.com",
      },
      submittedAt: "2023-07-14T14:30:00",
      files: ["algebra_homework.pdf", "calculations.xlsx"],
      status: "submitted",
    },
    {
      id: "SUB-002",
      student: {
        id: "STU-002",
        name: "Jane Smith",
        avatar: "JS",
        email: "jane@example.com",
      },
      submittedAt: "2023-07-16T09:15:00",
      files: ["algebra_assignment.pdf"],
      grade: 85,
      feedback: "Good work but missed some steps in problem 3",
      status: "graded",
    },
    {
      id: "SUB-003",
      student: {
        id: "STU-003",
        name: "Alex Johnson",
        avatar: "AJ",
        email: "alex@example.com",
      },
      submittedAt: "2023-07-10T11:45:00",
      files: ["math_hw.docx"],
      grade: 92,
      feedback: "Excellent work!",
      status: "graded",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [rubric, setRubric] = useState<RubricItem[]>(assignment.rubric);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("submissions");

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) =>
    sub.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRubricChange = (
    id: string,
    field: string,
    value: number | string
  ) => {
    setRubric(
      rubric.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotalGrade = () => {
    return rubric.reduce((total, item) => total + (item.earnedPoints || 0), 0);
  };

  const handleSubmitGrade = () => {
    if (!selectedSubmission) return;

    const totalGrade = calculateTotalGrade();
    console.log(
      `Graded submission ${selectedSubmission.id} with ${totalGrade}/${assignment.totalPoints}`
    );
    // In a real app, this would send to your backend
    setSelectedSubmission({
      ...selectedSubmission,
      grade: totalGrade,
      feedback: overallFeedback,
      status: "graded",
    });
  };

  return (
    <div>
      <Header title="Grade Submission" />
      <div className="p-6">
        {/* Assignment Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{assignment.title}</h1>
              <p className="text-gray-600">
                {assignment.course} • Due:{" "}
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {assignment.totalPoints} points
              </span>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <FiDownload /> Download All
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "submissions"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions ({submissions.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "rubric"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("rubric")}
          >
            Rubric
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "grades"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("grades")}
          >
            Grades Overview
          </button>
        </div>

        {activeTab === "submissions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submission List */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div
                className="divide-y divide-gray-200 overflow-y-auto"
                style={{ maxHeight: "600px" }}
              >
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSubmission?.id === submission.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {submission.student.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {submission.student.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(submission.submittedAt).toLocaleString()}
                            {new Date(submission.submittedAt) >
                              new Date(assignment.dueDate) && (
                              <span className="text-red-500 ml-2">Late</span>
                            )}
                          </p>
                        </div>
                      </div>
                      {submission.status === "graded" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Graded: {submission.grade}/{assignment.totalPoints}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grading Panel */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                      {selectedSubmission.student.name}'s Submission
                    </h2>
                    <div className="flex space-x-3">
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                        <FiMessageSquare /> Message
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                        <FiDownload /> Download
                      </button>
                    </div>
                  </div>

                  {/* Submission Files */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Submitted Files</h3>
                    <div className="space-y-2">
                      {selectedSubmission.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center">
                            <FiFileText className="text-gray-500 mr-2" />
                            <span>{file}</span>
                          </div>
                          <button className="text-blue-500 hover:text-blue-700">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                
                  <div className="mb-6">
                    <h3 className="font-medium mb-4">Rubric Assessment</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Criteria
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Max Points
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Earned Points
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Comments
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rubric.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.criteria}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {item.maxPoints}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                max={item.maxPoints}
                                className="w-20 p-1 border rounded"
                                value={item.earnedPoints || ""}
                                onChange={(e) =>
                                  handleRubricChange(
                                    item.id,
                                    "earnedPoints",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                className="w-full p-1 border rounded"
                                placeholder="Add comments..."
                                value={item.comments || ""}
                                onChange={(e) =>
                                  handleRubricChange(
                                    item.id,
                                    "comments",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

           
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Overall Feedback</h3>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Provide overall feedback for the student..."
                      value={overallFeedback}
                      onChange={(e) => setOverallFeedback(e.target.value)}
                    ></textarea>
                  </div>

            
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Total Grade</h4>
                        <p className="text-sm text-gray-600">
                          {calculateTotalGrade()} / {assignment.totalPoints}{" "}
                          points
                        </p>
                      </div>
                      <div className="text-2xl font-bold">
                        {Math.round(
                          (calculateTotalGrade() / assignment.totalPoints) * 100
                        )}
                        %
                      </div>
                    </div>
                  </div>

             
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Save Draft
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      onClick={handleSubmitGrade}
                    >
                      <FiCheck /> Submit Grade
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center h-64">
                  <div className="text-gray-400 mb-2">
                    Select a submission to grade
                  </div>
                  <FiChevronDown className="text-gray-400 text-xl" />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "rubric" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Assignment Rubric</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Criteria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Max Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignment.rubric.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.criteria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.maxPoints}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                       
                        N/A
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Add New Rubric Item
            </button>
          </div>
        )}

        {activeTab === "grades" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Grades Overview</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Submitted On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {submission.student.avatar}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            submission.status === "graded"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {submission.status.charAt(0).toUpperCase() +
                            submission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.grade
                          ? `${submission.grade}/${assignment.totalPoints}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setActiveTab("submissions");
                          }}
                        >
                          {submission.status === "graded" ? "View" : "Grade"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{submissions.length}</span> of{" "}
                  <span className="font-medium">{submissions.length}</span>{" "}
                  submissions
                </span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Publish All Grades
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeSubmissionPage;
