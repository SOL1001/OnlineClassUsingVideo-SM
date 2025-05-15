import {
  FiVideo,
  FiCalendar,
  FiClock,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiMic,
  FiMicOff,
  FiCamera,
  FiCameraOff,
  FiShare2,
  FiMessageSquare,
  FiMoreVertical,
  FiSearch,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

type LiveClass = {
  id: string;
  title: string;
  course: string;
  schedule: Date;
  duration: number; // in minutes
  status: "upcoming" | "ongoing" | "completed";
  participants: number;
  recordingUrl?: string;
};

const LiveClassPage = () => {
  const [classes, setClasses] = useState<LiveClass[]>([
    {
      id: "LC-001",
      title: "Algebra Fundamentals",
      course: "Mathematics",
      schedule: new Date(Date.now() + 3600000),
      duration: 60,
      status: "upcoming",
      participants: 0,
    },
    {
      id: "LC-002",
      title: "Chemical Reactions",
      course: "Science",
      schedule: new Date(Date.now() - 1800000),
      duration: 45,
      status: "ongoing",
      participants: 18,
      recordingUrl: "https://example.com/recording/LC-002",
    },
    {
      id: "LC-003",
      title: "Shakespeare Analysis",
      course: "English",
      schedule: new Date(Date.now() - 86400000),
      duration: 90,
      status: "completed",
      participants: 24,
      recordingUrl: "https://example.com/recording/LC-003",
    },
  ]);

  const courses = [
    "All Courses",
    "Mathematics",
    "Science",
    "English",
    "History",
  ];
  const statuses = ["All Statuses", "upcoming", "ongoing", "completed"];

  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newClass, setNewClass] = useState({
    title: "",
    course: "Mathematics",
    schedule: "",
    duration: 60,
  });
  const [isInClass, setIsInClass] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [activeTab, setActiveTab] = useState("classes");

  const filteredClasses = classes.filter((liveClass) => {
    const matchesSearch = liveClass.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" || liveClass.course === selectedCourse;
    const matchesStatus =
      selectedStatus === "All Statuses" || liveClass.status === selectedStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleCreateClass = () => {
    const newClassObj: LiveClass = {
      id: `LC-${Math.floor(Math.random() * 10000)}`,
      title: newClass.title,
      course: newClass.course,
      schedule: new Date(newClass.schedule),
      duration: newClass.duration,
      status: "upcoming",
      participants: 0,
    };

    setClasses([newClassObj, ...classes]);
    setIsCreating(false);
    setNewClass({
      title: "",
      course: "Mathematics",
      schedule: "",
      duration: 60,
    });
  };

  const startClass = (id: string) => {
    // In a real app, this would connect to your video conferencing API
    console.log(`Starting class ${id}`);
    setIsInClass(true);

    // Update class status to ongoing
    setClasses(
      classes.map((c) => (c.id === id ? { ...c, status: "ongoing" } : c))
    );
  };

  const endClass = (id: string) => {
    // In a real app, this would disconnect from the video API
    console.log(`Ending class ${id}`);
    setIsInClass(false);

    // Update class status to completed and generate recording URL
    setClasses(
      classes.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "completed",
              recordingUrl: `https://example.com/recording/${id}`,
            }
          : c
      )
    );
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  // Check for classes that should be ongoing
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClasses((prevClasses) =>
        prevClasses.map((c) => {
          const start = new Date(c.schedule);
          const end = new Date(start.getTime() + c.duration * 60000);

          if (now >= start && now <= end && c.status === "upcoming") {
            return { ...c, status: "ongoing" };
          }
          if (now > end && c.status === "ongoing") {
            return { ...c, status: "completed" };
          }
          return c;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header title={"Live Class Management"} />
      <div className="p-6 mt-20">
        {activeTab === "classes" && (
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search classes..."
                    className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

            {/* Classes List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((liveClass) => (
                      <tr key={liveClass.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {liveClass.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {liveClass.duration} minutes
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {liveClass.course}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {liveClass.schedule.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {liveClass.schedule.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              liveClass.status === "upcoming"
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiUsers className="mr-1" />
                            {liveClass.participants}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link to={"/Video"}>
                              <FiVideo
                                size={18}
                                className="text-green-600 hover:text-green-900"
                              />
                            </Link>
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
                        No classes found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveClassPage;
