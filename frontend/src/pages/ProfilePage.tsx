import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
  FiAward,
  FiBook,
  FiCheckCircle,
} from "react-icons/fi";
import Header from "../components/Header";

interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  updatedAt: string;
  submissions: any[];
  assignments: any[];
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignmentsCompleted: 0,
    assignmentsPending: 0,
    averageGrade: 0,
    lastSubmission: null as string | null,
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Calculate stats from user data
      const completed = parsedUser.submissions?.length || 0;
      const pending = parsedUser.assignments?.length || 0;

      setStats({
        assignmentsCompleted: completed,
        assignmentsPending: pending - completed,
        averageGrade: calculateAverageGrade(parsedUser.submissions),
        lastSubmission: getLastSubmissionDate(parsedUser.submissions),
      });
    }
    setLoading(false);
  }, []);

  const calculateAverageGrade = (submissions: any[]) => {
    if (!submissions || submissions.length === 0) return 0;
    const total = submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
    return Math.round(total / submissions.length);
  };

  const getLastSubmissionDate = (submissions: any[]) => {
    if (!submissions || submissions.length === 0) return null;
    return submissions.reduce((latest, sub) => {
      const currentDate = new Date(sub.submittedDate || 0);
      return currentDate > new Date(latest) ? sub.submittedDate : latest;
    }, submissions[0].submittedDate);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        No user data found. Please log in.
      </div>
    );
  }

  return (
    <div>
      <Header title="Profile" />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="bg-indigo-100 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-indigo-600 text-3xl md:text-4xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {user.username}
                </h1>
                <p className="text-gray-600 flex items-center">
                  <FiMail className="mr-2" /> {user.email}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs md:text-sm">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs md:text-sm">
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg w-full md:w-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Joined</p>
                      <p className="text-sm md:text-base font-medium">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">
                        Last Active
                      </p>
                      <p className="text-sm md:text-base font-medium">
                        {formatDate(user.lastLogin)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <FiBook className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Assignments</p>
                  <p className="text-xl font-bold">
                    {stats.assignmentsCompleted + stats.assignmentsPending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <FiCheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="text-xl font-bold text-green-600">
                    {stats.assignmentsCompleted}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <FiClock className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {stats.assignmentsPending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <FiAward className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Grade</p>
                  <p className="text-xl font-bold text-purple-600">
                    {stats.averageGrade}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submission */}
          {stats.lastSubmission && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Recent Submission
              </h2>
              <div className="flex items-start">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <FiBook className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Last assignment submitted</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(stats.lastSubmission)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Account Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Account Details
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-40 text-sm text-gray-500">Username</label>
                <p className="text-sm md:text-base font-medium">
                  {user.username}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-40 text-sm text-gray-500">Email</label>
                <p className="text-sm md:text-base font-medium">{user.email}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-40 text-sm text-gray-500">
                  Account Status
                </label>
                <p className="text-sm md:text-base">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-40 text-sm text-gray-500">User Role</label>
                <p className="text-sm md:text-base">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-40 text-sm text-gray-500">
                  Member Since
                </label>
                <p className="text-sm md:text-base font-medium">
                  {formatDate(user.createdAt)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="w-40 text-sm text-gray-500">Last Login</label>
                <p className="text-sm md:text-base font-medium">
                  {formatDate(user.lastLogin)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
