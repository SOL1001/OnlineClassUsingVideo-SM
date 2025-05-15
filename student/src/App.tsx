import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import StudentEnrollment from "./pages/TeacherInformation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import GradeSubmission from "./pages/EnrollmentStatus";
import Assignments from "./pages/Assignments";
import ResourceUpload from "./pages/CourseMaterials";
import Notifications from "./pages/Notifications";
import Class from "./pages/Class";
import Video from "./pages/video/Class";
import ProfilePage from "./pages/ProfilePage";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {isLoggedIn && (
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            onLogout={handleLogout}
          />
        )}
        {isLoggedIn && (
          <button
            className="md:hidden fixed top-4 left-4 z-10 p-2 rounded-md bg-blue-600 text-white shadow-lg"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        )}
        <div
          className={`flex-1 overflow-auto transition-all duration-300 ${
            isLoggedIn ? "" : ""
          }`}
        >
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLogin={() => setIsLoggedIn(true)} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Signup onSignup={() => setIsLoggedIn(true)} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/TeacherInformation"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <StudentEnrollment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Assignments"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Assignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/EnrollmentStatus"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <GradeSubmission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CourseMaterials"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ResourceUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Notifications"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/class"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Class />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Video"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Video />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
