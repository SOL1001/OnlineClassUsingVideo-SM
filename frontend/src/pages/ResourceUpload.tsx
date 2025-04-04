import {
  FiUpload,
  FiFile,
  FiVideo,
  FiImage,
  FiMusic,
  FiTrash2,
  FiDownload,
  FiSearch,
  FiFolderPlus,
} from "react-icons/fi";
import { useState, useRef, ChangeEvent } from "react";
import Header from "../components/Header";

type Resource = {
  id: string;
  name: string;
  type: "pdf" | "video" | "image" | "audio" | "document" | "other";
  size: string;
  uploadedAt: string;
  course: string;
  downloads: number;
};

const ResourceUploadPage = () => {
  
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "RES-001",
      name: "Algebra_Chapter_1.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedAt: "2023-06-15T10:30:00",
      course: "Mathematics",
      downloads: 24,
    },
    {
      id: "RES-002",
      name: "Chemical_Reactions.mp4",
      type: "video",
      size: "45.2 MB",
      uploadedAt: "2023-06-10T14:15:00",
      course: "Science",
      downloads: 18,
    },
    {
      id: "RES-003",
      name: "Shakespeare_Notes.docx",
      type: "document",
      size: "1.1 MB",
      uploadedAt: "2023-06-05T09:45:00",
      course: "English",
      downloads: 32,
    },
  ]);

  const courses = [
    "All Courses",
    "Mathematics",
    "Science",
    "English",
    "History",
  ];
  const resourceTypes = [
    "All Types",
    "pdf",
    "video",
    "image",
    "audio",
    "document",
    "other",
  ];

  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [selectedType, setSelectedType] = useState(resourceTypes[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

 
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourse === "All Courses" || resource.course === selectedCourse;
    const matchesType =
      selectedType === "All Types" || resource.type === selectedType;

    return matchesSearch && matchesCourse && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FiFile className="text-red-500" />;
      case "video":
        return <FiVideo className="text-blue-500" />;
      case "image":
        return <FiImage className="text-green-500" />;
      case "audio":
        return <FiMusic className="text-purple-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesToUpload(Array.from(e.target.files));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
       
          const newResources = filesToUpload.map((file) => ({
            id: `RES-${Math.floor(Math.random() * 10000)}`,
            name: file.name,
            type: getFileType(file.type),
            size: formatFileSize(file.size),
            uploadedAt: new Date().toISOString(),
            course: "Mathematics", 
            downloads: 0,
          }));

          setResources([...newResources, ...resources]);
          setFilesToUpload([]);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getFileType = (mimeType: string): Resource["type"] => {
    if (mimeType.includes("pdf")) return "pdf";
    if (mimeType.includes("video")) return "video";
    if (mimeType.includes("image")) return "image";
    if (mimeType.includes("audio")) return "audio";
    if (mimeType.includes("word") || mimeType.includes("document"))
      return "document";
    return "other";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  return (
    <div>
      <Header title={"Resource Upload"} />
      <div className="p-6">
      
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Teaching Resources</h1>
            <p className="text-gray-600">
              Upload and manage educational materials for your students
            </p>
          </div>
          <button
            onClick={triggerFileInput}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <FiUpload /> Upload Resources
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>

    
        {filesToUpload.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6 border-2 border-dashed border-blue-200">
            <h2 className="text-lg font-medium mb-4">
              Files to Upload ({filesToUpload.length})
            </h2>

            <div className="space-y-3 mb-4">
              {filesToUpload.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    {getFileIcon(getFileType(file.type))}
                    <span className="ml-2">{file.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>

            {isUploading ? (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            ) : (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setFilesToUpload([])}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={simulateUpload}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <FiUpload /> Start Upload
                </button>
              </div>
            )}
          </div>
        )}

      
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <FiFolderPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <FiFile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

      
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg mb-3">
                    <div className="text-4xl">{getFileIcon(resource.type)}</div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium mb-1 truncate">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {resource.course}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{resource.size}</span>
                      <span>
                        {new Date(resource.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiDownload className="mr-1" />
                      <span>{resource.downloads}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Download"
                      >
                        <FiDownload size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                        onClick={() => deleteResource(resource.id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiFile className="mx-auto text-gray-400 text-4xl mb-3" />
            <h3 className="text-lg font-medium text-gray-900">
              No resources found
            </h3>
            <p className="text-gray-500 mt-1">
              Upload your first resource using the button above
            </p>
          </div>
        )}

        {/* Storage Usage (would be dynamic in real app) */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-medium mb-4">Storage Usage</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>6.5 GB of 10 GB used</span>
            <span>65%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceUploadPage;
