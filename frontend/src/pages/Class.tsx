import { FiVideo, FiPlus, FiCalendar, FiBook } from "react-icons/fi";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ResponseModal from "../components/ResponseModal";

type LiveClass = {
  _id: string;
  className: string;
  course: string;
  schedule: string;
  status: string;
};

const LiveClassPage = () => {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [course, setCourse] = useState("");
  const [schedule, setSchedule] = useState("");
  const status = "scheduled";
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
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/video-classes/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            className,
            course,
            schedule,
            status,
          }),
        }
      );

      if (response.ok) {
        feachData();
        setOpen(false);
        setResponseModal({
          ...responseModal,
          open: true,
          title: "Success",
          message: "Class created successfully!",

          success: true,

          btnLabel: "",
          onClose: handleResponseCloseModal,
          onConfirm: () => {
            setResponseModal({ ...responseModal, open: false });
            // window.location.reload();
          },
        });
        // Reset form
        setClassName("");
        setCourse("");
        setSchedule("");
      } else {
        console.error("Failed to create class");
        setResponseModal({
          ...responseModal,
          open: true,
          title: "Error",
          message: "Failed to create class. Please try again.",
          success: false,
          btnLabel: "",
          onClose: handleResponseCloseModal,
          onConfirm: () => {
            setResponseModal({ ...responseModal, open: false });
            // window.location.reload();
          },
        });
      }
    } catch (error) {
      console.error("Error creating class:", error);
      setResponseModal({
        ...responseModal,
        open: true,
        title: "Error",
        message: "Failed to create class. Please try again.",
        success: false,
        btnLabel: "",
        onClose: handleResponseCloseModal,
        onConfirm: () => {
          setResponseModal({ ...responseModal, open: false });
          // window.location.reload();
        },
      });
    }
  };

  const feachData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/video-classes/my-classes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setClasses(data.data);
      } else {
        console.error("Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    feachData();
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={"Live Class Management"} />
      <div className="p-6 mt-20 max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Header with action button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              My Live Classes
            </h2>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-colors shadow-md"
            >
              <FiPlus size={18} />
              Add New Class
            </button>
          </div>

          {/* Classes Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {classes.length > 0 ? (
                    classes.map((liveClass) => (
                      <tr
                        key={liveClass._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiVideo className="text-blue-600" size={18} />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {liveClass.className}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiBook className="text-gray-400 mr-2" size={16} />
                            <span className="text-sm text-gray-700">
                              {liveClass.course}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiCalendar
                              className="text-gray-400 mr-2"
                              size={16}
                            />
                            <span className="text-sm text-gray-700">
                              {formatDate(liveClass.schedule)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              liveClass.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : liveClass.status === "ongoing"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {liveClass.status.charAt(0).toUpperCase() +
                              liveClass.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-4">
                            <Link
                              to={"/Video"}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Join Class"
                            >
                              <FiVideo size={20} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FiVideo size={48} className="mb-4" />
                          <p className="text-lg font-medium">
                            No classes found
                          </p>
                          <p className="text-sm mt-1">
                            Create your first live class by clicking the "Add
                            New Class" button
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Class Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create New Live Class
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="className"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Class Name
                    </label>
                    <input
                      type="text"
                      id="className"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Introduction to React"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Course
                    </label>
                    <input
                      type="text"
                      id="course"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Web Development"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="schedule"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="schedule"
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md"
                    >
                      Create Class
                    </button>
                  </div>
                </div>
              </form>
            </div>
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

export default LiveClassPage;
