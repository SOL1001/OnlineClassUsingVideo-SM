import React from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GradingIcon from "@mui/icons-material/Grading";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
// import SchoolIcon from "@mui/icons-material/School";
import VideoChatIcon from "@mui/icons-material/VideoChat";
interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<{
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}> = ({ isOpen, toggleSidebar, onLogout }) => {
  const navItems: NavItem[] = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      path: "/Student Enrollment",
      label: "Student Enrollment",
      icon: <PersonIcon />,
    },
    {
      path: "/Assignments",
      label: "Assignments",
      icon: <AssignmentIcon />,
    },
    {
      path: "/GradeSubmission",
      label: "Grade Submission",
      icon: <GradingIcon />,
    },
    {
      path: "/ResourceUpload",
      label: "Resource Upload",
      icon: <DriveFolderUploadIcon />,
    },
    {
      path: "/class",
      label: "Live Class Management",
      icon: <VideoChatIcon />,
    },
  ];

  return (
    <aside
      className={`fixed z-30 inset-y-0 left-0 w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 h-screen`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold truncate">Teacher</h1>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 mt-auto">
          <button
            onClick={onLogout}
            className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded-md"
          >
            Log Out
          </button>
          <p className="text-xs text-gray-400">© 2023 My App</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
