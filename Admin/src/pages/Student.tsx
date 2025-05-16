import { useEffect, useState } from "react";
import {
  // FiSearch,
  FiUserPlus,
  // FiDownload,
  // FiFilter,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiPrinter,
} from "react-icons/fi";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../components/Header";
import ResponseModal from "../components/ResponseModal";
const StudentEnrollmentPage = () => {
  const courses = ["All Courses", "Mathematics", "Science", "English"];
  const statuses = ["All Statuses", "active", "pending", "rejected"];

  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  // const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      fetchData();
       setResponseModal({
        ...responseModal,
        open: true,
        title: "Success",
        message: "Student created successfully",
        btnConfirm: false,
        success: true,
        btnLabel2: "OK",
        btnLabel: "",
        onClose: handleResponseCloseModal,
      });
    } else {
      const errorData = await response.text();
      setError(errorData);
        setResponseModal({
        ...responseModal,
        open: true,
        title: "Error",
        message: errorData,
        btnConfirm: false,
        success: false,
        btnLabel2: "OK",
        btnLabel: "",
        onClose: handleResponseCloseModal,
      });
    }
  };


  const [data, setData] = useState<any[]>([]);
  const [total2, setTotal2] = useState(0);
  const [open, setOpen] = useState(false);
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
        setData(data.data.filter((student: any) => student.role === "student"));
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
  
  const [id, setID] = useState("");
    const handleDelete = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
        if (response.ok) {
          console.log("Teacher deleted successfully");
          fetchData(); // Refresh the data after deletion
          setResponseModal({
            ...responseModal,
            open: true,
            title: "Success",
            message: "Teacher deleted successfully",
            btnConfirm: false,
            success: true,
            btnLabel2: "OK",
            btnLabel: "",
            onClose: handleResponseCloseModal,
          });
        } else {
          console.error("Failed to delete student");
          setResponseModal({
            ...responseModal,
            open: true,
            title: "Error",
            message: "Failed to delete Teacher",
            btnConfirm: false,
            success: false,
            btnLabel2: "OK",
            btnLabel: "",
            onClose: handleResponseCloseModal,
          });
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        setResponseModal({
          ...responseModal,
          open: true,
          title: "Error",
          message: "Error deleting Teacher",
          btnConfirm: false,
          success: false,
          btnLabel2: "OK",
          btnLabel: "",
          onClose: handleResponseCloseModal,
        });
      }
    };
  
  return (
    <div>
      <Header title="Student Enrollment" />
      <div className="p-6 mt-28">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* <h1 className="text-2xl font-bold">Student Enrollment</h1> */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#00A16A] text-white px-4 py-2 rounded  transition-colors"
            >
              <FiUserPlus />
              Add New Student
            </button>
       
          </div>
        </div>

       

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
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
                {data ? (
                  data.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {student.avatar}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                        >
                          active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                           <button
                            onClick={() =>{
                              console.log(student._id);
                              setID(student._id);
                              setResponseModal({
                                ...responseModal,
                                open: true,
                                title: "Delete Teacher",
                                message: "Are you sure you want to delete this Teacher?",
                                btnConfirm: true,
                                success: false,
                                btnLabel2: "Delete",
                                btnLabel: "Cancel",
                                onClose: handleResponseCloseModal,
                                onConfirm: handleDelete,
                              });
                              }}
                           className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No students found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h1>Create Student account</h1>
              <button className=" text-gray-600" onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div>
              {error && (
                <div
                  className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-center border border-red-200 dark:border-red-800"
                  role="alert"
                >
                  {error}
                </div>
              )}
            </div>
            <form onSubmit={
              (e) => {
                e.preventDefault();
                handleRegister();
              }
              }>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  // value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your username"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  // value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  // value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your password"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#00A16A] text-white font-semibold py-2 rounded-md "
                >
                  Create Student
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

export default StudentEnrollmentPage;
