import {
  FiSearch,
  FiPlus,
  FiDownload,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import ResponseModal from "../components/ResponseModal";
import { Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Submited from "./submitd/Submited";

type Assignment = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  submissions: {
    submitted: number;
    total: number;
  };
  status: "draft" | "published" | "graded";
  createdAt: string;
};

const AssignmentPage = () => {
  // Sample data
  const assignments: Assignment[] = [
    {
      id: "ASG-001",
      title: "Algebra Fundamentals",
      course: "Mathematics",
      dueDate: "2023-07-15",
      submissions: {
        submitted: 15,
        total: 20,
      },
      status: "published",
      createdAt: "2023-06-10",
    },
    {
      id: "ASG-002",
      title: "Chemical Reactions Lab",
      course: "Science",
      dueDate: "2023-07-20",
      submissions: {
        submitted: 8,
        total: 20,
      },
      status: "published",
      createdAt: "2023-06-15",
    },
    {
      id: "ASG-003",
      title: "Shakespeare Analysis",
      course: "English",
      dueDate: "2023-07-25",
      submissions: {
        submitted: 0,
        total: 18,
      },
      status: "draft",
      createdAt: "2023-06-18",
    },
    {
      id: "ASG-004",
      title: "World War II Essay",
      course: "History",
      dueDate: "2023-06-30",
      submissions: {
        submitted: 22,
        total: 22,
      },
      status: "graded",
      createdAt: "2023-05-28",
    },
  ];

  const courses = [
    "All Courses",
    "Mathematics",
    "Science",
    "English",
    "History",
  ];
  const statuses = ["All Statuses", "draft", "published", "graded"];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);

  // Filter assignments
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" || assignment.course === selectedCourse;
    const matchesStatus =
      selectedStatus === "All Statuses" || assignment.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // .....
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
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    formData.append("maxScore", String(maxScore));
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Assignment submitted successfully");
        fetchAssignments();

        setResponseModal({
          ...responseModal,
          open: true,
          title: "Assignments",
          message: "Assignment created successfully",
          btnConfirm: false,
          success: true,
          onClose: () => {
            setOpen(false);
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
          message: "Failed to create assignment",
          success: false,
          onClose: () => {
            setOpen(false);
            handleResponseCloseModal();
          },
        });
        console.error("Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };
  const [id, setId] = useState("");

  const handleSubmit2 = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    formData.append("maxScore", String(maxScore));
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/assignments/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Assignment submitted successfully");
        fetchAssignments();

        setResponseModal({
          ...responseModal,
          open: true,
          title: "Assignments",
          message: "Assignment Updated successfully",
          btnConfirm: false,
          success: true,
          onClose: () => {
            setOpen2(false);
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
          message: "Failed to Update assignment",
          success: false,
          onClose: () => {
            setOpen2(false);
            handleResponseCloseModal();
          },
        });
        console.error("Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  const handleDelete = async (data: any) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/assignments/${data}`,
        {
          method: "Delete",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (response.ok) {
        console.log("Assignment submitted successfully");
        fetchAssignments();

        setResponseModal({
          ...responseModal,
          open: true,
          title: "Assignments",
          message: "Assignment Deleted successfully",
          btnConfirm: false,
          success: true,
          onClose: () => {
            setOpen2(false);
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
          message: "Failed to Deleted assignment",
          success: false,
          onClose: () => {
            setOpen2(false);
            handleResponseCloseModal();
          },
        });
        console.error("Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };
  const [data, setData] = useState<any[]>([]);
  const [total2, setTotal2] = useState(0);
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
    fetchAssignments();
  }, []);
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [data2, setData2] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const fetchAssignments2 = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/submissions/teacher",
        {
          // Corrected URL
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
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
    fetchAssignments2();
  }, []);
  return (
    <div>
      <Header title="Assignments" />
      <div className="p-6">
        {/* Stats Cards */}

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Assignment" value="1" />
              <Tab label="Submitted Assignment" value="2" />
              {/* <Tab label="Item Three" value="3" /> */}
            </TabList>
          </Box>

          {/* <TabPanel value="3">Item Three</TabPanel> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Total Assignments
              </h3>
              <p className="text-3xl font-bold">{total2}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Submitted Assignments
              </h3>
              <p className="text-3xl font-bold text-yellow-600">{total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Graded Assignments
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {assignments.filter((a) => a.status === "graded").length}
              </p>
            </div>
          </div>
          <TabPanel value="2">
            <Submited response={{ success: true, data: data2 }}></Submited>
          </TabPanel>
          <TabPanel value="1">
            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center m-4 gap-4">
              <div>
                {/* <h1 className="text-2xl font-bold">Assignments</h1> */}
                <p className="text-gray-600">
                  Create and manage assignments for your courses
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  <FiPlus />
                  New Assignment
                </button>
               
              </div>
            </div>

            {/* Assignments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Creator
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Max Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.length > 0 ? (
                      data.map((assignment) => (
                        <tr key={assignment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {assignment.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Created:{" "}
                              {new Date(
                                assignment.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment?.creator.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`flex items-center ${
                                new Date(assignment?.dueDate) < new Date()
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {new Date(assignment.dueDate) < new Date() && (
                                <FiAlertCircle className="mr-1" />
                              )}
                              {new Date(
                                assignment.dueDate
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.maxScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span
                                className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  assignment.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {assignment.status.charAt(0).toUpperCase() +
                                  assignment.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <a
                                href={
                                  assignment?.file?.path
                                    ? `http://localhost:5000/${assignment.file.path}`
                                    : "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                                title="Download File"
                              >
                                Download
                              </a>
                              <button
                                onClick={() => {
                                  setId(assignment._id);
                                  setOpen2(true);
                                  setTitle(assignment.title);
                                  setDescription(assignment.description);
                                  setDueDate(
                                    new Date(assignment.dueDate)
                                      .toISOString()
                                      .split("T")[0]
                                  );
                                  setMaxScore(assignment.maxScore);
                                  setFile(null);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <FiEdit2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setResponseModal({
                                    ...responseModal,
                                    open: true,
                                    title: "Warning",
                                    message:
                                      "Are you sure you want to delete this Assignment?",
                                    success: false,
                                    btnConfirm: true,
                                    btnLabel2: "Delete",
                                    btnLabel: "Cancel",
                                    onConfirm: () => {
                                      handleDelete(assignment._id);
                                    },
                                    onClose: () => {
                                      handleResponseCloseModal();
                                    },
                                  });
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
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
          </TabPanel>
        </TabContext>
      </div>
      <Modal open={open2} onClose={() => setOpen2(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setOpen2(false)}
            >
              <CloseIcon />
            </button>
            <Typography variant="h6" className="mb-4">
              Create Assignment
            </Typography>
            <form onSubmit={handleSubmit2}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Max Score
                </label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload File (optional)
                </label>
                <input
                  type="file"
                  accept="*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
            <Typography variant="h6" className="mb-4">
              Create Assignment
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Max Score
                </label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload File (optional)
                </label>
                <input
                  type="file"
                  accept="*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
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

export default AssignmentPage;
