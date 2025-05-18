import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const EnrollmentStatusPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/grades/student", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      } else {
        throw new Error(response.statusText || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateGrade = (
    assignment: number,
    midExam: number,
    finalExam: number
  ) => {
    const total = assignment + midExam + finalExam;
    if (total >= 90)
      return { grade: "A", color: "bg-emerald-100 text-emerald-800" };
    if (total >= 80) return { grade: "B", color: "bg-blue-100 text-blue-800" };
    if (total >= 70)
      return { grade: "C", color: "bg-amber-100 text-amber-800" };
    if (total >= 60)
      return { grade: "D", color: "bg-orange-100 text-orange-800" };
    return { grade: "F", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Enrollment Status & Grades" />

      <main className="flex-1 p-4 md:p-6 mt-[66px]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                My Courses
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                View your course grades and feedback
              </p>
            </div>

            {loading ? (
              <div className="p-8 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="text-gray-600">Loading your courses...</p>
              </div>
            ) : error ? (
              <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="p-3 bg-red-50 rounded-full">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  Something went wrong
                </h3>
                <p className="text-gray-600 max-w-md">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                  </svg>
                  <span>Try again</span>
                </button>
              </div>
            ) : courses.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="p-3 bg-indigo-50 rounded-full">
                  <svg
                    className="w-8 h-8 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  No courses found
                </h3>
                <p className="text-gray-600 max-w-md">
                  You are not enrolled in any courses yet or your grades haven't
                  been published.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mid Exam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Final Exam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => {
                      const { grade, color } = calculateGrade(
                        course.assignmentScore,
                        course.midExamScore,
                        course.finalExamScore
                      );
                      const totalScore =
                        course.assignmentScore +
                        course.midExamScore +
                        course.finalExamScore;

                      return (
                        <tr
                          key={course.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {course.subject || "Unnamed Course"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {course.teacher?.username || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {course.assignmentScore ?? "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {course.midExamScore ?? "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {course.finalExamScore ?? "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {totalScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}
                            >
                              {grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs">
                            {course.feedback || (
                              <span className="text-gray-400">
                                No feedback provided
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnrollmentStatusPage;
