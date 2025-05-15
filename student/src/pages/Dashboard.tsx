import React, { useState } from "react";
import {
  FiHome,
  FiBook,
  FiFileText,
  FiVideo,
  FiMessageSquare,
  FiSettings,
  FiBell,
  FiSearch,
  FiCalendar,
} from "react-icons/fi";
import Header from "../components/Header";
import { Link } from "react-router-dom";

type Course = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  nextClass?: string;
};

type Assignment = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "late" | "graded";
  grade?: number;
};

type LiveClass = {
  id: string;
  title: string;
  course: string;
  schedule: string;
  status: "upcoming" | "ongoing";
};

const OverviewPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "MATH-101",
      title: "Algebra Fundamentals",
      instructor: "Prof. Smith",
      progress: 65,
      nextClass: "2023-07-15T10:00:00",
    },
    {
      id: "SCI-201",
      title: "Chemical Reactions",
      instructor: "Dr. Johnson",
      progress: 42,
      nextClass: "2023-07-16T14:00:00",
    },
    {
      id: "ENG-102",
      title: "English Literature",
      instructor: "Dr. Williams",
      progress: 88,
    },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "ASG-001",
      title: "Algebra Homework",
      course: "Algebra Fundamentals",
      dueDate: "2023-07-18T23:59:00",
      status: "pending",
    },
    {
      id: "ASG-002",
      title: "Lab Report",
      course: "Chemical Reactions",
      dueDate: "2023-07-15T23:59:00",
      status: "submitted",
    },
    {
      id: "ASG-003",
      title: "Shakespeare Essay",
      course: "English Literature",
      dueDate: "2023-07-10T23:59:00",
      status: "graded",
      grade: 88,
    },
  ]);

  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([
    {
      id: "LC-001",
      title: "Algebra Review",
      course: "Algebra Fundamentals",
      schedule: "2023-07-15T10:00:00",
      status: "upcoming",
    },
    {
      id: "LC-002",
      title: "Chemistry Lab",
      course: "Chemical Reactions",
      schedule: "2023-07-14T14:00:00",
      status: "ongoing",
    },
  ]);

  const joinClass = (classId: string) => {
    console.log(`Joining class ${classId}`);
  };

  const viewAssignment = (assignmentId: string) => {
    console.log(`Viewing assignment ${assignmentId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Dashboard" />

      <main className="p-6 flex-1 overflow-auto mt-[66px] ">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-2">Welcome back, Student!</h2>
            <p className="opacity-90">
              You have{" "}
              {assignments.filter((a) => a.status === "pending").length} pending
              assignments and {liveClasses.length} upcoming classes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Active Courses
              </h3>
              <p className="text-3xl font-bold">{courses.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pending Assignments
              </h3>
              <p className="text-3xl font-bold text-yellow-600">
                {assignments.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Average Grade
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {assignments.filter((a) => a.grade).length > 0
                  ? Math.round(
                      assignments
                        .filter((a) => a.grade)
                        .reduce((acc, curr) => acc + (curr.grade || 0), 0) /
                        assignments.filter((a) => a.grade).length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upcoming Live Classes</h2>
            </div>
            <div className="space-y-4">
              {liveClasses.slice(0, 2).map((liveClass) => (
                <div
                  key={liveClass.id}
                  className="flex items-start p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`p-3 rounded-full mr-4 ${
                      liveClass.status === "ongoing"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <FiVideo />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{liveClass.title}</h3>
                    <p className="text-sm text-gray-500">{liveClass.course}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(liveClass.schedule).toLocaleString([], {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {liveClass.status === "ongoing" && (
                        <span className="ml-2 text-green-600">• Live Now</span>
                      )}
                    </p>
                  </div>
                  <Link
                    to={"/Video"}
                    className={`px-4 py-2 rounded-lg ${"bg-green-600 text-white hover:bg-green-700"}`}
                  >
                    Join Now
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Assignments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.slice(0, 3).map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {assignment.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assignment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : assignment.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : assignment.status === "late"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {assignment.status.charAt(0).toUpperCase() +
                            assignment.status.slice(1)}
                          {assignment.grade && assignment.status === "graded"
                            ? ` (${assignment.grade}%)`
                            : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewAssignment(assignment.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {assignment.status === "pending" ? "Submit" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
