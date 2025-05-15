import React from "react";

interface File {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
}

interface Student {
  _id: string;
  username: string;
  email: string;
}

interface Submission {
  _id: string;
  file: File;
  assignment: Assignment;
  student: Student;
  submittedAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ResponseData {
  success: boolean;
  data?: Submission[];
}

const SubmissionList: React.FC<{ response: ResponseData }> = ({ response }) => {
  if (!response || !response.data || !Array.isArray(response.data)) {
    return <p>No submissions available.</p>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {response.data &&
        response.data.map((submission) => (
          <div
            className="border border-gray-300 rounded-lg p-4 bg-white shadow-md"
            key={submission._id}
          >
            <h3 className="text-lg font-semibold">
              {submission.assignment?.title || "Untitled Assignment"}
            </h3>
            <p className="mt-2">
              <strong>Description:</strong>{" "}
              {submission.assignment?.description || "Untitled Assignment"}
            </p>
            <p className="mt-2">
              <strong>Submitted By:</strong>{" "}
              {submission.student.username || "Untitled Assignment"} (
              {submission.student.email})
            </p>
            <p className="mt-2">
              <strong>Submitted At:</strong>{" "}
              {new Date(
                submission.submittedAt || "Untitled Assignment"
              ).toLocaleString()}
            </p>
            <p className="mt-2">
              <strong>Status:</strong>{" "}
              {submission.status || "Untitled Assignment"}
            </p>
            <a
              // href={submission.file.path}
              // download
              // className="mt-4 inline-block text-blue-600 hover:underline"
              href={`http://localhost:5000/${
                submission.file.path || "Untitled Assignment"
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-900"
              title="Download File"
            >
              Download {submission.file.originalname}
            </a>
          </div>
        ))}
    </div>
  );
};

export default SubmissionList;
