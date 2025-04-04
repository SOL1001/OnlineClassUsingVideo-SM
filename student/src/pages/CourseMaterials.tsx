import {
  FiBook,
  FiDownload,
  FiFileText,
  FiVideo,
  FiImage,
  FiMusic,
  FiFolder,
  FiChevronDown,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import { useState } from "react";
import Header from "../components/Header";

type Resource = {
  id: string;
  name: string;
  type: "pdf" | "video" | "image" | "audio" | "document" | "link" | "quiz";
  size?: string;
  uploadedAt: string;
  downloads?: number;
  url?: string;
};

type Module = {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  isOpen: boolean;
};

const CourseMaterialPage = () => {
  // Sample course data
  const course = {
    title: "Algebra Fundamentals",
    instructor: "Prof. Sarah Johnson",
    progress: 65,
    code: "MATH-101",
  };

  // Sample modules with resources
  const [modules, setModules] = useState<Module[]>([
    {
      id: "MOD-001",
      title: "Module 1: Introduction to Algebra",
      description: "Basic concepts and foundations of algebraic thinking",
      isOpen: true,
      resources: [
        {
          id: "RES-001",
          name: "Algebra Basics Lecture Slides",
          type: "pdf",
          size: "2.4 MB",
          uploadedAt: "2023-06-10",
          downloads: 124,
          url: "#",
        },
        {
          id: "RES-002",
          name: "Introduction to Variables (Video)",
          type: "video",
          size: "45.2 MB",
          uploadedAt: "2023-06-12",
          downloads: 98,
          url: "#",
        },
        {
          id: "RES-003",
          name: "Practice Problems Set",
          type: "document",
          size: "1.1 MB",
          uploadedAt: "2023-06-12",
          downloads: 156,
          url: "#",
        },
      ],
    },
    {
      id: "MOD-002",
      title: "Module 2: Linear Equations",
      description: "Solving equations with one variable",
      isOpen: false,
      resources: [
        {
          id: "RES-004",
          name: "Linear Equations Handbook",
          type: "pdf",
          size: "3.2 MB",
          uploadedAt: "2023-06-15",
          downloads: 87,
          url: "#",
        },
        {
          id: "RES-005",
          name: "Equation Solving Techniques",
          type: "video",
          size: "52.7 MB",
          uploadedAt: "2023-06-16",
          downloads: 76,
          url: "#",
        },
      ],
    },
    {
      id: "MOD-003",
      title: "Module 3: Quadratic Equations",
      description: "Introduction to polynomials and factoring",
      isOpen: false,
      resources: [
        {
          id: "RES-006",
          name: "Quadratic Formula Cheat Sheet",
          type: "pdf",
          size: "1.8 MB",
          uploadedAt: "2023-06-20",
          downloads: 64,
          url: "#",
        },
        {
          id: "RES-007",
          name: "Factoring Practice Quiz",
          type: "quiz",
          uploadedAt: "2023-06-21",
          url: "#",
        },
      ],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const toggleModule = (moduleId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId ? { ...module, isOpen: !module.isOpen } : module
      )
    );
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FiFileText className="text-red-500" />;
      case "video":
        return <FiVideo className="text-blue-500" />;
      case "image":
        return <FiImage className="text-green-500" />;
      case "audio":
        return <FiMusic className="text-purple-500" />;
      case "quiz":
        return <FiBook className="text-yellow-500" />;
      case "link":
        return <FiFolder className="text-gray-500" />;
      default:
        return <FiFileText className="text-gray-500" />;
    }
  };

  const filteredModules = modules
    .map((module) => ({
      ...module,
      resources: module.resources.filter((resource) =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((module) => module.resources.length > 0 || searchTerm === "");

  return (
    <div>
      <Header title="Course Materials" />
      <div className="p-6 md:mt-[68px] mt-16">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {course.title}
              </h1>
              <p className="text-gray-600">
                Course Code: {course.code} | Instructor: {course.instructor}
              </p>
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <span className="block text-sm text-gray-500">Progress</span>
                <span className="font-medium">{course.progress}% Complete</span>
              </div>
              <div className="w-12 h-12">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${course.progress}, 100`}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

      
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Resource Types</option>
              <option>PDFs</option>
              <option>Videos</option>
              <option>Documents</option>
              <option>Quizzes</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredModules.length > 0 ? (
            filteredModules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{module.title}</h3>
                    <p className="text-sm text-gray-500">
                      {module.description}
                    </p>
                  </div>
                  {module.isOpen ? (
                    <FiChevronDown className="text-gray-500" />
                  ) : (
                    <FiChevronRight className="text-gray-500" />
                  )}
                </button>

                {module.isOpen && (
                  <div className="border-t divide-y divide-gray-100">
                    {module.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="mt-1 mr-4">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{resource.name}</h4>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-x-4 gap-y-1">
                              {resource.size && <span>{resource.size}</span>}
                              <span>Uploaded: {resource.uploadedAt}</span>
                              {resource.downloads && (
                                <span>{resource.downloads} downloads</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex space-x-2">
                            <a
                              href={resource.url}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                              title="Download"
                            >
                              <FiDownload />
                            </a>
                            {resource.type === "quiz" && (
                              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                Take Quiz
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FiBook className="mx-auto text-gray-400 text-4xl mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                No materials found
              </h3>
              <p className="text-gray-500 mt-1">
                {searchTerm
                  ? "Try a different search term"
                  : "No materials have been uploaded yet"}
              </p>
            </div>
          )}
        </div>

     
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <FiDownload className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">
                  You downloaded "Linear Equations Handbook"
                </p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-4">
                <FiVideo className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">
                  You watched "Equation Solving Techniques"
                </p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-full mr-4">
                <FiBook className="text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">
                  You completed "Factoring Practice Quiz" with 85%
                </p>
                <p className="text-sm text-gray-500">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterialPage;
