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
import { Modal, Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import ResponseModal from "../components/ResponseModal";

// type Resource = {
//   id: string;
//   name: string;
//   type: "pdf" | "video" | "image" | "audio" | "document" | "other";
//   size: string;
//   uploadedAt: string;
//   course: string;
//   downloads: number;
// };
// ;;;;;;/
interface FileDetails {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}
const ResourceUploadPage: React.FC = () => {
  // const [resources, setResources] = useState<any[]>([
  //   {
  //     id: "RES-001",
  //     name: "Algebra_Chapter_1.pdf",
  //     type: "pdf",
  //     size: "2.4 MB",
  //     uploadedAt: "2023-06-15T10:30:00",
  //     course: "Mathematics",
  //     downloads: 24,
  //   },
  //   {
  //     id: "RES-002",
  //     name: "Chemical_Reactions.mp4",
  //     type: "video",
  //     size: "45.2 MB",
  //     uploadedAt: "2023-06-10T14:15:00",
  //     course: "Science",
  //     downloads: 18,
  //   },
  //   {
  //     id: "RES-003",
  //     name: "Shakespeare_Notes.docx",
  //     type: "document",
  //     size: "1.1 MB",
  //     uploadedAt: "2023-06-05T09:45:00",
  //     course: "English",
  //     downloads: 32,
  //   },
  // ]);

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
  // const [isUploading, setIsUploading] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const filteredResources = resources.filter((resource) => {
  //   const matchesSearch = resource.name
  //     .toLowerCase()
  //     .includes(searchTerm.toLowerCase());
  //   const matchesCourse =
  //     selectedCourse === "All Courses" || resource.course === selectedCourse;
  //   const matchesType =
  //     selectedType === "All Types" || resource.type === selectedType;

  //   return matchesSearch && matchesCourse && matchesType;
  // });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FiFile className="text-red-500" />;
      case "document":
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

  // const triggerFileInput = () => {
  //   fileInputRef.current?.click();
  // };

  // const simulateUpload = () => {
  //   setIsUploading(true);
  //   setUploadProgress(0);

  //   const interval = setInterval(() => {
  //     setUploadProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval);
  //         setIsUploading(false);

  //         const newResources = filesToUpload.map((file) => ({
  //           id: `RES-${Math.floor(Math.random() * 10000)}`,
  //           name: file.name,
  //           type: getFileType(file.type),
  //           size: formatFileSize(file.size),
  //           uploadedAt: new Date().toISOString(),
  //           course: "Mathematics",
  //           downloads: 0,
  //         }));

  //         setResources([...newResources, ...resources]);
  //         setFilesToUpload([]);
  //         return 0;
  //       }
  //       return prev + 10;
  //     });
  //   }, 300);
  // };

  // const getFileType = (mimeType: string): Resource["type"] => {
  //   if (mimeType.includes("pdf")) return "pdf";
  //   if (mimeType.includes("video")) return "video";
  //   if (mimeType.includes("image")) return "image";
  //   if (mimeType.includes("audio")) return "audio";
  //   if (mimeType.includes("word") || mimeType.includes("document"))
  //     return "document";
  //   return "other";
  // };

  // const formatFileSize = (bytes: number) => {
  //   if (bytes < 1024) return `${bytes} B`;
  //   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  //   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  // };

  // ..........................................
  const [responseModal, setResponseModal] = useState({
    open: false,
    title: "",
    message: "",
    btnConfirm: false,
    success: false,
    btnLabel2: "",
    btnLabel: "",
    onClose: () => {},
    onConfirm: () => {},
  });
  const handleResponseCloseModal = () => {
    setResponseModal({
      ...responseModal,
      open: false,
      btnConfirm: false,
      title: "",
      message: "",
      success: false,
      btnLabel: "",
    });
    handleClose();
    // setRequestWithdrawOpen(false);
    // setUpdateOpen(false);
  };
  const [open, setOpen] = useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [resources2, setResources2] = useState<any[]>();
  const fechData = async () => {
    const token = localStorage.getItem("token"); // Get token from local storage
    try {
      const response = await fetch(
        "http://localhost:5000/api/material/teacher",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Data fetched successfully:", data.data);
        setResources2(data.data);
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Call fechData when the component mounts
  useEffect(() => {
    fechData();
  }, []);

  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileDetails({
        filename: selectedFile.name,
        originalname: selectedFile.name,
        mimetype: selectedFile.type,
        size: selectedFile.size,
        path: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleSubmit = async () => {
    if (!file) return; // Ensure a file is selected

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("fileType", fileType);
    formData.append("file", file); // Append the file directly

    const token = localStorage.getItem("token"); // Get token from local storage

    try {
      const response = await fetch(
        "http://localhost:5000/api/material/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          body: formData, // Send FormData
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Upload successful:", data);
        if (response.ok) {
          console.log("Assignment submitted successfully");
          fechData();

          setResponseModal({
            ...responseModal,
            open: true,
            title: "Resource Upload",
            message: "Resource Uploaded successfully",

            btnConfirm: false,
            success: true,
            onClose: () => {
              handleClose();
              handleResponseCloseModal();
            },
          });
        } else {
          setResponseModal({
            ...responseModal,
            open: true,
            btnConfirm: false,

            title: "Resource Upload",
            message: "Failed to upload the resource",
            success: false,
            onClose: () => {
              handleClose();
              handleResponseCloseModal();
            },
          });
          console.error("Upload failed:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error during upload:", error);
    }
  };

  const handleDelete = async (id: any) => {
    const token = localStorage.getItem("token"); // Get token from local storage
    try {
      const response = await fetch(
        `http://localhost:5000/api/material/delete/martial/${id}`,
        {
          method: "Delete",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      if (response.ok) {
        fechData();
        const data = await response.json();
        console.log("Data fetched successfully:", data.data);
        setResources2(data.data);
        setResponseModal({
          ...responseModal,
          open: true,
          title: "Delete Martial",
          message: "martial Deleted successfully",

          btnConfirm: false,
          success: true,
          onClose: () => {
            handleResponseCloseModal();
          },
        });
      } else {
        setResponseModal({
          ...responseModal,
          open: true,
          btnConfirm: false,
          title: "Assignments",
          message: "Failed to Deleted the martial",
          success: false,
          onClose: () => {
            handleResponseCloseModal();
          },
        });
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div>
      <div>
        {" "}
        <Header title={"Resource Upload"} />
      </div>

      <div className="p-6 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Teaching Resources</h1>
            <p className="text-gray-600">
              Upload and manage educational materials for your students
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
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

        {/* {filesToUpload.length > 0 && (
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
        )} */}

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

        {resources2 && resources2.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources2.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 flex flex-col h-full ">
                  <a
                    href={
                      resource?.file?.path
                        ? `http://localhost:5000/${resource.file.path}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download File"
                    className="flex items-center justify-center p-4 bg-gray-100 hover:bg-slate-600 rounded-lg mb-3 hover:scale-[0.9] hover:transition-transform hover:duration-200"
                  >
                    <div className="text-4xl ">
                      {getFileIcon(resource.fileType)}
                    </div>
                  </a>

                  <div className="flex-1">
                    <h3 className="font-medium mb-1 truncate">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {resource.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{resource.file.size}</span>
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
                      <a
                        href={resource.file.path}
                        download
                        className="text-blue-500 hover:text-blue-700 p-1 hover:animate-download-scoop"
                        title="Download"
                      >
                        <FiDownload size={18} />
                      </a>
                      <button
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                        // onClick={() => deleteResource(resource.id)}
                        onClick={() => {
                          setResponseModal({
                            ...responseModal,
                            open: true,
                            title: "Warning",
                            message:
                              "Are you sure you want to delete this Material?",
                            success: false,
                            btnConfirm: true,
                            btnLabel2: "Delete",
                            btnLabel: "Cancel",
                            onConfirm: () => {
                              handleDelete(resource._id);
                            },
                            onClose: () => {
                              handleResponseCloseModal();
                            },
                          });
                        }}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white  shadow-lg p-4">
          <h2 id="modal-title" className="text-lg font-bold mb-10">
            Upload File
          </h2>
          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            className="mt-2 p-4 border border-gray-400 rounded w-full shadow mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Description</label>
          <textarea
            rows={4}
            placeholder="Description"
            className="mt-2 p-4 border border-gray-400 rounded w-full shadow mb-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>File Type</label>
          <input
            type="text"
            placeholder="fileType"
            className="mt-2 p-4 border border-gray-400 rounded w-full shadow mb-4"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-4 border rounded p-2 w-full"
          />
          {fileDetails && (
            <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 text-xs text-gray-500">
              <h3 className="font-semibold">File Details:</h3>
              <p>
                <strong>Filename:</strong> {fileDetails.filename}
              </p>
              <p>
                <strong>Original Name:</strong> {fileDetails.originalname}
              </p>
              <p>
                <strong>MIME Type:</strong> {fileDetails.mimetype}
              </p>
              <p>
                <strong>Size:</strong> {fileDetails.size} bytes
              </p>
              <p>
                <strong>Path:</strong> {fileDetails.path}
              </p>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <Button onClick={handleSubmit} variant="contained" className="mt-4">
              Submit
            </Button>
          </div>

          {/* <Button onClick={handleClose} variant="outlined" className="mt-2">
            Close
          </Button> */}
        </div>
      </Modal>
      <ResponseModal
        onClose={handleResponseCloseModal}
        onConfirm={responseModal.onConfirm}
        open={responseModal.open}
        message={responseModal.message}
        title={responseModal.title}
        btnLabel2={responseModal.btnLabel2}
        btnConfirm={responseModal.btnConfirm}
        btnLabel={responseModal.btnLabel}
        success={responseModal.success}
      />
    </div>
  );
};

export default ResourceUploadPage;
