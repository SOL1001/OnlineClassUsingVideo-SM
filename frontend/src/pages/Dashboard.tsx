import {
  FiBook,
  FiUsers,
  FiFileText,
  FiVideo,
  FiAlertCircle,
  FiUpload,
} from "react-icons/fi";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";


const StatCard = ({ icon, title, value, change }) => (
  <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="p-3 rounded-full bg-opacity-20 bg-blue-100">{icon}</div>
      <span className="text-sm text-gray-500">{change}</span>
    </div>
    <h3 className="text-lg font-semibold mt-2">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const SessionItem = ({ session }) => (
  <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div
      className={`p-2 rounded-full mr-4 ${
        session.type === "live"
          ? "bg-blue-100 text-blue-600"
          : "bg-purple-100 text-purple-600"
      }`}
    >
      <FiVideo />
    </div>
    <div className="flex-1">
      <h3 className="font-medium">{session.course}</h3>
      <p className="text-sm text-gray-500">{session.time}</p>
    </div>
    <button className="text-blue-500 hover:text-blue-700 text-sm">
      {session.type === "live" ? "Join" : "Details"}
    </button>
  </div>
);

const AnnouncementItem = ({ announcement }) => (
  <div className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
    <div className="flex items-start">
      {announcement.urgent && (
        <FiAlertCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
      )}
      <div>
        <h3 className="font-medium">{announcement.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {announcement.date} • {announcement.author}
        </p>
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ icon: Icon, color, label, onClick }) => (
  <button
    className={`flex flex-col items-center p-4 border rounded-lg hover:bg-${color}-50 transition-colors`}
    onClick={onClick}
  >
    <div className={`p-3 bg-${color}-100 rounded-full mb-2 text-${color}-600`}>
      <Icon size={20} />
    </div>
    <span>{label}</span>
  </button>
);

const OverviewPage = () => {
  const stats = [
    {
      icon: <FiUsers className="text-blue-500" size={20} />,
      title: "Total Students",
      value: 24,
      change: "+3 this week",
    },
    {
      icon: <FiBook className="text-green-500" size={20} />,
      title: "Active Courses",
      value: 3,
      change: "2 ongoing",
    },
    {
      icon: <FiFileText className="text-yellow-500" size={20} />,
      title: "Assignments Due",
      value: 5,
      change: "3 to grade",
    },
    {
      icon: <FiVideo className="text-purple-500" size={20} />,
      title: "Live Sessions",
      value: 2,
      change: "Today & Tomorrow",
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      course: "Mathematics - Algebra",
      time: "Today, 10:00 AM",
      type: "live",
    },
    {
      id: 2,
      course: "Science - Chemistry",
      time: "Tomorrow, 2:00 PM",
      type: "live",
    },
    {
      id: 3,
      course: "English Literature",
      time: "Jun 25, 11:00 AM",
      type: "office-hours",
    },
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: "School Reopening Guidelines",
      date: "Jun 10, 2023",
      author: "Admin",
      urgent: true,
    },
    {
      id: 2,
      title: "Quarterly Exam Schedule",
      date: "Jun 5, 2023",
      author: "Admin",
      urgent: false,
    },
    {
      id: 3,
      title: "New Teaching Resources Available",
      date: "May 28, 2023",
      author: "Director",
      urgent: false,
    },
  ];
const navigate = useNavigate();
  const quickActions = [
    {
      icon: FiFileText,
      color: "blue",
      label: "Create Assignment",
      onclick: () => navigate("/Assignments"),
    },
    {
      icon: FiUpload,
      color: "green",
      label: "Upload Resources",
      onclick: () => navigate("/ResourceUpload"),
    },
    {
      icon: FiVideo,
      color: "purple",
      label: "Schedule Class",
      onclick: () => navigate("/Class"),
    },
    {
      icon: FiUsers,
      color: "yellow",
      label: "Add Student",
      onclick: () => navigate("/Student%20Enrollment"),
    },
  ];

  return (
    <div className="">
      <div>
      <Header title={"Dashboard"} />

      </div>
      <div className="space-y-6 p-4 md:p-6 mt-20">
         <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, Teacher!{" "}
              {
                (() => {
                  const userStr = localStorage.getItem("userData");
                  if (!userStr) return "";
                  try {
                    const user = JSON.parse(userStr);
                    return user?.username
 ?? "";
                  } catch {
                    return "";
                  }
                })()
              }
            </h2>
            
          </div>
         <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionButton
                key={`action-${index}`}
                icon={action.icon}
                color={action.color}
                label={action.label}
                onClick={action.onclick}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={`stat-${index}`} {...stat} />
          ))}
        </div>
 
      </div>
    </div>
  );
};

export default OverviewPage;
