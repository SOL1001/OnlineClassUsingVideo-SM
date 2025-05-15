import {
  FiUpload,
  FiFile,
  FiVideo,
  FiImage,
  FiMusic,
  FiDownload,
  FiSearch,
  FiFolderPlus,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";

type Resource = {
  id: string;
  title: string;
  description: string;
  fileType: string;
  file: {
    path: string;
    size: number; // Changed to number for accurate calculations
  };
  uploadedAt: string;
  downloads: number;
  course?: string; // Added optional course field
};

const ResourceUploadPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [selectedType, setSelectedType] = useState("All Types");

  // Dynamic courses and file types from fetched data
  const [courses, setCourses] = useState<string[]>(["All Courses"]);
  const [fileTypes, setFileTypes] = useState<string[]>(["All Types"]);

  // Storage calculations
  const [storageUsed, setStorageUsed] = useState(0);
  const storageLimit = 10 * 1024 * 1024 * 1024; // 10GB in bytes

  const fetchResources = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:5000/api/material/student",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      const fetchedResources: Resource[] = data.data || [];

      // Calculate storage used
      const totalSize = fetchedResources.reduce(
        (sum, resource) => sum + (resource.file.size || 0),
        0
      );
      setStorageUsed(totalSize);

      // Extract unique courses and file types
      const uniqueCourses = [
        "All Courses",
        ...new Set(fetchedResources.map((r) => r.course).filter(Boolean)),
      ] as string[];
      const uniqueFileTypes = [
        "All Types",
        ...new Set(fetchedResources.map((r) => r.fileType).filter(Boolean)),
      ] as string[];

      setCourses(uniqueCourses);
      setFileTypes(uniqueFileTypes);
      setResources(fetchedResources);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const getFileIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      pdf: <FiFile className="text-red-500" />,
      document: <FiFile className="text-blue-500" />,
      video: <FiVideo className="text-purple-500" />,
      image: <FiImage className="text-green-500" />,
      audio: <FiMusic className="text-yellow-500" />,
    };
    return icons[type] || <FiFile className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" || resource.course === selectedCourse;
    const matchesType =
      selectedType === "All Types" || resource.fileType === selectedType;

    return matchesSearch && matchesCourse && matchesType;
  });

  const storagePercentage = Math.min(
    100,
    Math.round((storageUsed / storageLimit) * 100)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Learning Resources" />

      <main className="p-6 mt-24 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
          <p className="text-gray-600 mt-2">
            Access and download all your course resources in one place
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFolderPlus className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFile className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {fileTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
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
                  Error loading resources: {error}
                  <button
                    onClick={fetchResources}
                    className="ml-2 text-sm font-medium text-red-700 hover:text-red-600"
                  >
                    Retry
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-5 flex flex-col h-full">
                  {/* File Icon/Preview */}
                  <a
                    href={`http://localhost:5000/${resource.file.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-6 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-5xl">
                      {getFileIcon(resource.fileType)}
                    </div>
                  </a>

                  {/* Resource Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                      <span>{formatFileSize(resource.file.size)}</span>
                      <span>
                        {new Date(resource.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiDownload className="mr-1" />
                      <span>{resource.downloads} downloads</span>
                    </div>
                    <a
                      href={`http://localhost:5000/${resource.file.path}`}
                      download
                      className="text-indigo-600 hover:text-indigo-800 p-1"
                      title="Download"
                    >
                      <FiDownload size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FiFile className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No resources found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm
                ? "Try adjusting your search"
                : "No materials have been uploaded yet"}
            </p>
          </div>
        )}

        {/* Storage Usage */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium text-gray-900">Storage Usage</h2>
            <span className="text-sm text-gray-500">
              {storagePercentage}% used
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatFileSize(storageUsed)} used</span>
            <span>{formatFileSize(storageLimit - storageUsed)} available</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourceUploadPage;
