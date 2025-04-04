import { useState, useEffect } from "react";
import Header from "../components/Header";

// Type definitions
interface TeacherStats {
  assignmentsCount: number;
  submissionsCount: number;
}

interface Teacher {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  stats: TeacherStats;
}

interface TeachersResponse {
  success: boolean;
  count: number;
  data: Teacher[];
}

// TeacherCard component
const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 text-xl font-semibold">
                {teacher.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {teacher.username}
            </h3>
            <p className="text-gray-600">{teacher.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Assignments</p>
            <p className="text-xl font-bold text-indigo-600">
              {teacher.stats.assignmentsCount}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Submissions</p>
            <p className="text-xl font-bold text-indigo-600">
              {teacher.stats.submissionsCount}
            </p>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Status: {teacher.status}</span>
          <span>
            Joined: {new Date(teacher.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main TeachersPage component
const TeachersPage = () => {
  const [teachers, setTeachers] = useState<TeachersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/teachers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TeachersResponse = await response.json();

        if (!data.success) {
          throw new Error("Failed to fetch teachers data");
        }

        setTeachers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div>
      <Header title="Teachers Information" />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Teachers
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Meet the educators who guide your learning journey
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="ml-3 text-gray-600">Loading teachers...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Error loading teachers: {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {teachers && (
            <>
              <div className="mb-6 text-right">
                <span className="text-sm text-gray-500">
                  Showing {teachers.count} teachers
                </span>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {teachers.data.map((teacher) => (
                  <TeacherCard key={teacher._id} teacher={teacher} />
                ))}
              </div>
            </>
          )}

          {!loading && !error && teachers?.count === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No teachers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no teachers available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;
