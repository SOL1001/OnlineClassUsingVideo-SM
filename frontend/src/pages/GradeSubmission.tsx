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
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ResponseModal from "../components/ResponseModal";

type Submission = {
  username: string;
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
      { id: "RUB-1", criteria: "Assessment Score", maxPoints: 25 },
      { id: "RUB-2", criteria: "Mid Exam Score", maxPoints: 25 },
      { id: "RUB-3", criteria: "Final Exam Score", maxPoints: 50 },
      // { id: "RUB-4", criteria: "Timeliness", maxPoints: 10 },
    ] as RubricItem[],
  };

 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [rubric, setRubric] = useState<RubricItem[]>(assignment.rubric);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("submissions");

  // Filter submissions
 

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

  // .....................
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
  const [data, setData] = useState<any[]>([]);
  const [total2, setTotal2] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/students", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setData(data.data);
        setTotal2(data.data.length);

        console.log("Assignments fetched successfully:", data);
      } else {
        console.error("Failed to fetch assignments");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [data2, setData2] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchData2 = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/grades/teacher", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setData2(data.data);
        setTotal(data.data.length);

        console.log("Assignments fetched successfully:", data);
      } else {
        console.error("Failed to fetch assignments");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchData2();
  }, []);
  const [assignmentScore, setAssignmentScore] = useState<number | undefined>();
  const [midExamScore, setMidExamScore] = useState<number | undefined>();
  const [finalExamScore, setFinalExamScore] = useState<number | undefined>();
  const [feedback, setFeedback] = useState("");
  // const [id, setId] = useState("");
  const handleGrade = async (id: any) => {
    // Mock API call to submit the grade
    const response = await fetch(
      `http://localhost:5000/api/grades?studentId=${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentScore: assignmentScore,
          midExamScore: midExamScore,
          finalExamScore: finalExamScore,
          feedback: feedback,
        }),
      }
    );

    if (response.ok) {
      setResponseModal({
        ...responseModal,
        open: true,
        title: "Grade Submission",
        message: "Grade submitted successfully",
        btnConfirm: false,
        success: true,
        onClose: () => {
          handleResponseCloseModal();
        },
      });
    } else {
      setResponseModal({
        ...responseModal,
        open: true,
        title: "Grade Submission",
        message: "Failed to add grade",
        btnConfirm: false,
        success: false,
        onClose: () => {
          handleResponseCloseModal();
        },
      });
    }
    // Reset selected submission and feedback
    setSelectedSubmission(null);
    setOverallFeedback("");
    // Optionally, refresh the submission list or update the UI
    // fetchSubmissions();
    // or update the state with new data
    // setSubmissions(updatedSubmissions);
    // This is just a placeholder for the actual API call
    // In a real application, you would handle the response and update the UI accordingly
    // For example, you might want to refresh the submission list or show a success message
  };
  return (
    <div>
      <Header title="Grade Submission" />
      <div className="p-6 mt-20">
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
            Submissions 
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
                {data.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedSubmission?.id === submission.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedSubmission(submission);
                      // setId(submission._id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {/* {submission.student.avatar} */}
                            {submission.username
                              .split(" ")
                              .map((name: string, index: number) =>
                                index < 2 ? name.charAt(0).toUpperCase() : ""
                              )
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{submission.username}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(submission.createdAt).toLocaleString()}
                            {new Date(submission.createdAt) >
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
                      {selectedSubmission.username}'s Submission
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
                  {/* <div className="mb-6">
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
                  </div> */}

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
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            Assessment Score
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            25
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max={25}
                              className="w-20 p-1 border rounded"
                              value={assignmentScore}
                              onChange={(e) => {
                                handleRubricChange(
                                  "RUB-1", // Replace with the actual rubric item's id
                                  "earnedPoints",
                                  parseInt(e.target.value) || 0
                                );
                                setAssignmentScore(
                                  parseInt(e.target.value) || 0
                                );
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              className="w-full p-1 border rounded"
                              placeholder="Add comments..."
                              // value={item.comments || ""}
                              // onChange={(e) =>
                              //   handleRubricChange(
                              //     item.id,
                              //     "comments",
                              //     e.target.value
                              //   )
                              // }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            Mid Exam Score
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            25
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max={25}
                              className="w-20 p-1 border rounded"
                              value={midExamScore}
                              onChange={(e) => {
                                handleRubricChange(
                                  "RUB-2", // Replace with the actual rubric item's id
                                  "earnedPoints",
                                  parseInt(e.target.value) || 0
                                );
                                setMidExamScore(parseInt(e.target.value) || 0);
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              className="w-full p-1 border rounded"
                              placeholder="Add comments..."
                              // value={item.comments || ""}
                              // onChange={(e) =>
                              //   handleRubricChange(
                              //     item.id,
                              //     "comments",
                              //     e.target.value
                              //   )
                              // }
                            />
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            Final Exam Score
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            50
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max={50}
                              className="w-20 p-1 border rounded"
                              value={finalExamScore}
                              onChange={(e) => {
                                handleRubricChange(
                                  "RUB-3", // Replace with the actual rubric item's id
                                  "earnedPoints",
                                  parseInt(e.target.value) || 0
                                );
                                setFinalExamScore(
                                  parseInt(e.target.value) || 0
                                );
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              className="w-full p-1 border rounded"
                              placeholder="Add comments..."
                              // value={item.comments || ""}
                              // onChange={(e) =>
                              //   handleRubricChange(
                              //     item.id,
                              //     "comments",
                              //     e.target.value
                              //   )
                              // }
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Overall Feedback</h3>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Provide overall feedback for the student..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
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
                      onClick={() => handleGrade(selectedSubmission?._id)}
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
                      <td className="px-6 py-4 text-sm text-gray-500">N/A</td>
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
                      Submitted On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assignment Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mid Exam Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Final Exam Result
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data2.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {/* {submission.student.avatar} */}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.student.username}
                            </div>

                            <div className="text-sm text-gray-500">
                              {submission.student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.assignmentScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.midExamScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.finalExamScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.finalExamScore +
                          submission.midExamScore +
                          submission.assignmentScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const totalScore =
                            submission.finalExamScore +
                            submission.midExamScore +
                            submission.assignmentScore;
                          if (totalScore >= 90) return "A";
                          if (totalScore >= 80) return "B";
                          if (totalScore >= 70) return "C";
                          if (totalScore >= 60) return "D";
                          return "F";
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.feedback}
                      </td>

                      {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setActiveTab("submissions");
                          }}
                        >
                          {submission.status === "graded" ? "View" : "Grade"}
                        </button>
                      </td> */}
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

export default GradeSubmissionPage;
