import { FiVideo, FiPlus, FiCalendar, FiBook } from "react-icons/fi";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

type LiveClass = {
  _id: string;
  className: string;
  course: string;
  schedule: string;
  status: string;
};

const LiveClassPage = () => {
  const [classes, setClasses] = useState<LiveClass[]>([]);

  const feachData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/video-classes/all",
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
    </div>
  );
};

export default LiveClassPage;
