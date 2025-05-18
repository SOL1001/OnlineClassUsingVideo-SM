import { useEffect, useState, useRef, useCallback } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
  FiAward,
  FiBook,
  FiCheckCircle,
  FiUpload,
  FiEdit,
  FiKey,
} from "react-icons/fi";
import axios from "axios";
import Header from "../components/Header";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  avatarUrl?: string;
}

interface Stats {
  assignmentsCompleted: number;
  assignmentsPending: number;
  averageGrade: number;
  lastSubmission: string | null;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    assignmentsCompleted: 0,
    assignmentsPending: 0,
    averageGrade: 0,
    lastSubmission: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoized calculation functions
  const calculateAverageGrade = useCallback((submissions: any[]) => {
    if (!submissions || submissions.length === 0) return 0;
    const total = submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
    return Math.round(total / submissions.length);
  }, []);

  const getLastSubmissionDate = useCallback((submissions: any[]) => {
    if (!submissions || submissions.length === 0) return null;
    return submissions.reduce((latest, sub) => {
      const currentDate = new Date(sub.submittedDate || 0);
      return currentDate > new Date(latest) ? sub.submittedDate : latest;
    }, submissions[0].submittedDate);
  }, []);

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "Never";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  // Fetch avatar with proper cleanup
  const fetchAvatar = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setAvatarLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/users/get/avatar",
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
        }
      );

      if (response.data) {
        const url = URL.createObjectURL(response.data);

        setPreviewUrl(url);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching avatar:", error);
      }
    } finally {
      abortControllerRef.current = null;
      setAvatarLoading(false);
    }
  }, []);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setTempUsername(parsedUser.username);

        // Only fetch avatar if not already in user data
        if (!parsedUser.avatarUrl) {
          await fetchAvatar();
        } else {
          setPreviewUrl(parsedUser.avatarUrl);
        }

        // Calculate stats
        const completed = parsedUser.submissions?.length || 0;
        const pending = parsedUser.assignments?.length || 0;

        setStats({
          assignmentsCompleted: completed,
          assignmentsPending: pending - completed,
          averageGrade: calculateAverageGrade(parsedUser.submissions),
          lastSubmission: getLastSubmissionDate(parsedUser.submissions),
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [calculateAverageGrade, fetchAvatar, getLastSubmissionDate]);

  useEffect(() => {
    fetchUserData();

    return () => {
      // Cleanup: abort any pending request and revoke URL
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [fetchUserData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setUploadError("Please upload a JPEG, PNG, or GIF image");
        return;
      }

      if (file.size > maxSize) {
        setUploadError("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const response = await axios.put(
        "http://localhost:5000/api/users/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      window.location.reload();
      // Update user data
      const updatedUser = {
        ...(user as UserData),
        avatarUrl: response.data.avatarUrl,
      };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSelectedFile(null);
    } catch (error) {
      setUploadError(
        error.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!tempUsername.trim() || tempUsername === user?.username) {
      setEditMode(false);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/username",
        { username: tempUsername },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = {
        ...(user as UserData),
        username: tempUsername,
      };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-4xl p-4">
          <Skeleton height={40} className="mb-6" />
          <div className="flex gap-6 mb-8">
            <Skeleton circle height={96} width={96} />
            <div className="flex-1">
              <Skeleton height={32} width={200} className="mb-2" />
              <Skeleton height={24} width={300} className="mb-4" />
              <Skeleton height={28} width={120} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={80} />
            ))}
          </div>
          <Skeleton height={200} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <FiUser className="mx-auto text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No User Data Found
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Header title="Profile" />
      </div>
      <div className="min-h-screen bg-gray-50 p-4 mt-20 md:p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center relative">
                  {avatarLoading ? (
                    <Skeleton circle height="100%" width="100%" />
                  ) : previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewUrl(null)}
                    />
                  ) : (
                    <span className="text-indigo-600 text-4xl md:text-5xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <FiEdit className="text-white text-xl" />
                  </div>
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50 shadow-sm transition-all hover:shadow-md"
                  title="Change avatar"
                >
                  <FiUpload className="text-indigo-600" size={18} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-2">
                  {editMode ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        maxLength={30}
                      />
                      <button
                        onClick={handleUsernameUpdate}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setTempUsername(user.username);
                        }}
                        className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                        {user.username}
                      </h1>
                      <button
                        onClick={() => setEditMode(true)}
                        className="ml-2 p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Edit username"
                      >
                        <FiEdit size={18} />
                      </button>
                    </>
                  )}
                </div>

                <p className="text-gray-600 flex items-center mb-1">
                  <FiMail className="mr-2 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>

                {selectedFile && (
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className={`px-4 py-2 rounded-lg text-white ${
                        isUploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      } transition-colors`}
                    >
                      {isUploading ? "Uploading..." : "Save Avatar"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(user.avatarUrl || null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    {uploadError && (
                      <p className="text-red-500 text-sm">{uploadError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Account Stats */}
              <div className="bg-gray-50 p-4 rounded-lg w-full md:w-auto border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <FiCalendar className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Joined</p>
                      <p className="text-sm md:text-base font-medium">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiClock className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">
                        Last Active
                      </p>
                      <p className="text-sm md:text-base font-medium">
                        {formatDate(user.lastLogin)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiKey className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Role</p>
                      <p className="text-sm md:text-base font-medium capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiUser className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Status</p>
                      <p className="text-sm md:text-base font-medium capitalize">
                        {user.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg mr-3">
                    <FiBook className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Assignments</p>
                    <p className="text-xl font-bold">
                      {stats.assignmentsCompleted + stats.assignmentsPending}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-green-200 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-3">
                    <FiCheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-xl font-bold text-green-600">
                      {stats.assignmentsCompleted}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-yellow-200 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg mr-3">
                    <FiClock className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {stats.assignmentsPending}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:border-purple-200 transition-colors">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-3">
                    <FiAward className="text-purple-600" size={20} />
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
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="flex items-start">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <FiBook className="text-blue-600" size={20} />
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
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Account Details
                </h2>
                {/* <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <FiEdit className="mr-1" size={14} />
                  Edit Profile
                </button> */}
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <label className="w-40 text-sm text-gray-500">Username</label>
                  <p className="text-sm md:text-base font-medium">
                    {user.username}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <label className="w-40 text-sm text-gray-500">Email</label>
                  <p className="text-sm md:text-base font-medium">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <label className="w-40 text-sm text-gray-500">
                    Account Status
                  </label>
                  <p className="text-sm md:text-base">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <label className="w-40 text-sm text-gray-500">
                    User Role
                  </label>
                  <p className="text-sm md:text-base">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                  <label className="w-40 text-sm text-gray-500">
                    Member Since
                  </label>
                  <p className="text-sm md:text-base font-medium">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center py-2">
                  <label className="w-40 text-sm text-gray-500">
                    Last Login
                  </label>
                  <p className="text-sm md:text-base font-medium">
                    {formatDate(user.lastLogin)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
