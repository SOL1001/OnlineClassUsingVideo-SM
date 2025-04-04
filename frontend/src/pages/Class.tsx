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
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header title={"Live Class Management"} />
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            {/* <h1 className="text-2xl font-bold">Live Classes</h1> */}
            <p className="text-gray-600">
              Schedule and conduct live virtual classes
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> Schedule Class
          </button>
        </div>

     
        {isCreating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Schedule New Class</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newClass.title}
                    onChange={(e) =>
                      setNewClass({ ...newClass, title: e.target.value })
                    }
                    placeholder="Introduction to Algebra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newClass.course}
                    onChange={(e) =>
                      setNewClass({ ...newClass, course: e.target.value })
                    }
                  >
                    {courses
                      .filter((c) => c !== "All Courses")
                      .map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newClass.schedule}
                    onChange={(e) =>
                      setNewClass({ ...newClass, schedule: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newClass.duration}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        duration: parseInt(e.target.value) || 60,
                      })
                    }
                    min="15"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClass}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!newClass.title || !newClass.schedule}
                >
                  Schedule Class
                </button>
              </div>
            </div>
          </div>
        )}

     
        {isInClass && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
            <div className="flex-1 flex flex-col">
            
              <div className="flex-1 bg-gray-800 flex items-center justify-center relative">
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FiVideo size={24} />
                  </div>
                  <h3 className="text-xl font-medium">
                    Live Class in Progress
                  </h3>
                  <p className="text-gray-400">
                    Students will join automatically
                  </p>
                </div>

                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
                  <FiUsers className="mr-2" />
                  <span>18 participants</span>
                </div>

                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
                  {classes.find((c) => c.status === "ongoing")?.title}
                </div>
              </div>

      
              <div className="bg-gray-800 p-4 flex justify-center space-x-6">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full ${
                    isMicOn ? "bg-gray-700 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {isMicOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
                </button>

                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-3 rounded-full ${
                    isCameraOn
                      ? "bg-gray-700 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isCameraOn ? (
                    <FiCamera size={20} />
                  ) : (
                    <FiCameraOff size={20} />
                  )}
                </button>

                <button className="p-3 rounded-full bg-gray-700 text-white">
                  <FiShare2 size={20} />
                </button>

                <button className="p-3 rounded-full bg-gray-700 text-white">
                  <FiMessageSquare size={20} />
                </button>

                <button
                  onClick={() =>
                    endClass(
                      classes.find((c) => c.status === "ongoing")?.id || ""
                    )
                  }
                  className="p-3 rounded-full bg-red-600 text-white px-6"
                >
                  End Class
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "classes"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("classes")}
          >
            My Classes
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "recordings"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("recordings")}
          >
            Recordings
          </button>
        </div>

        {activeTab === "classes" && (
          <>
            {/* Filters */}
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
                            {liveClass.status === "upcoming" && (
                              <button
                                onClick={() => startClass(liveClass.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Start Class"
                              >
                                <FiVideo size={18} />
                              </button>
                            )}
                            {liveClass.status === "ongoing" && (
                              <button
                                onClick={() => setIsInClass(true)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Join Class"
                              >
                                <FiVideo size={18} />
                              </button>
                            )}
                            {liveClass.status === "completed" &&
                              liveClass.recordingUrl && (
                                <a
                                  href={liveClass.recordingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 hover:text-purple-900"
                                  title="View Recording"
                                >
                                  <FiVideo size={18} />
                                </a>
                              )}
                            <button
                              onClick={() =>
                                console.log(`Edit ${liveClass.id}`)
                              }
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => deleteClass(liveClass.id)}
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
                        No classes found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "recordings" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Class Recordings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes
                .filter((c) => c.recordingUrl)
                .map((liveClass) => (
                  <div
                    key={liveClass.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="bg-gray-200 h-40 flex items-center justify-center relative">
                      <FiVideo className="text-gray-400 text-4xl" />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {liveClass.duration} min
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{liveClass.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {liveClass.course}
                      </p>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{liveClass.schedule.toLocaleDateString()}</span>
                        <span>{liveClass.participants} participants</span>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <a
                          href={liveClass.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Watch Recording
                        </a>
                        <button className="text-gray-500 hover:text-gray-700">
                          <FiMoreVertical />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassPage;
