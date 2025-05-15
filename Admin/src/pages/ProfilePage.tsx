import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

interface UserData {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  chatIDs: string[];
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadUserData = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setError("No user data found. Please log in.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
        return;
      }

      const parsedUser: UserData = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      setError("Failed to load user data. Please log in again.");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-6"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
          <p className="text-gray-600 mt-2">Your account details</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center border border-red-200">
            {error}
          </div>
        )}

        {user && (
          <div className="space-y-6">
            {/* Avatar or Placeholder */}
            <div className="flex justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.username}'s avatar`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md"
                />
              ) : (
                <FaUserCircle
                  className="w-24 h-24 text-gray-400"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* User Details */}
            <div className="space-y-4">
              {[
                { label: "Username", value: user.username },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role.toLowerCase() },
                { label: "Account Created", value: formatDate(user.createdAt) },
              ].map((item, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-500">
                    {item.label}
                  </label>
                  <p className="text-gray-800 text-lg font-medium mt-1 p-2 bg-gray-50 rounded-lg">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
