import React, { useState } from "react";
import { FiSearch, FiBook, FiCheckCircle } from "react-icons/fi";
import Header from "../components/Header";

type Course = {
  id: string;
  title: string;
  instructor: string;
  enrollmentStatus: "enrolled" | "pending" | "dropped";
  grade?: number;
};

const EnrollmentStatusPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "MATH-101",
      title: "Algebra Fundamentals",
      instructor: "Prof. Smith",
      enrollmentStatus: "enrolled",
      grade: 85,
    },
    {
      id: "SCI-201",
      title: "Chemical Reactions",
      instructor: "Dr. Johnson",
      enrollmentStatus: "pending",
    },
    {
      id: "ENG-102",
      title: "English Literature",
      instructor: "Dr. Williams",
      enrollmentStatus: "enrolled",
      grade: 90,
    },
    {
      id: "HIST-202",
      title: "World History",
      instructor: "Dr. Brown",
      enrollmentStatus: "dropped",
    },
  ]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation */}
      {/* <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Enrollment Status & Grades
        </h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </header> */}
      <Header title="Enrollment Status & Grades" />

      <main className="p-6 flex-1 overflow-auto mt-[66px]">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">My Courses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Enrollment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.enrollmentStatus === "enrolled"
                            ? "bg-green-100 text-green-800"
                            : course.enrollmentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {course.enrollmentStatus.charAt(0).toUpperCase() +
                          course.enrollmentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.grade !== undefined ? `${course.grade}%` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnrollmentStatusPage;
