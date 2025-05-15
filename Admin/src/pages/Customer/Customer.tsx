import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../components/utils/apiRequest";
import Header from "../../components/Header";
import { Modal } from "@mui/material";
import ResponseModal from "../../components/ResponseModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

interface UserData {
  id: string;
  email: string;
  password: string;
  username: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  chatIDs: string[];
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
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

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");

    // Check authentication and admin role
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || !storedUser) {
      setError("Please log in to view users.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
      setIsLoading(false);
      return;
    }

    try {
      const parsedUser: UserData = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        setError("Access restricted to admin users.");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
        setIsLoading(false);
        return;
      }

      const response = await apiRequest.get<UserData[]>("/users");
      const userData = response.data;

      if (response.status === 200 && Array.isArray(userData)) {
        const filteredUsers = userData.filter((user) => user.role === "user");
        setUsers(filteredUsers);
      } else {
        setError("Failed to load user data.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "An error occurred while fetching users.";
      setError(message);
      if (err.response?.status === 401) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle modal close
  const handleResponseCloseModal = () => {
    setResponseModal({
      ...responseModal,
      open: false,
    });
  };

  // Handle delete user
  const handleDelete = async (id: string) => {
    try {
      const response = await apiRequest.delete(`/users/${id}`);

      if (response.status === 200) {
        fetchUsers();
        setResponseModal({
          ...responseModal,
          open: true,
          title: "Success",
          message: "User deleted successfully",
          btnConfirm: false,
          success: true,
        });
      }
    } catch (error) {
      setResponseModal({
        ...responseModal,
        open: true,
        title: "Error",
        message: "Failed to delete user",
        btnConfirm: false,
        success: false,
      });
    }
  };

  // Handle edit user
  const handleEdit = (user: UserData) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    setEditModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const response = await apiRequest.put(
        `/users/${currentUser.id}`,
        formData
      );

      if (response.status === 200) {
        fetchUsers();
        setEditModalOpen(false);
        setResponseModal({
          ...responseModal,
          open: true,
          title: "Success",
          message: "User updated successfully",
          btnConfirm: false,
          success: true,
        });
      }
    } catch (error) {
      setResponseModal({
        ...responseModal,
        open: true,
        title: "Error",
        message: "Failed to update user",
        btnConfirm: false,
        success: false,
      });
    }
  };

  // Handle form submission for add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest.post("auth/register", formData);

      if (response.status === 201) {
        fetchUsers();
        setAddModalOpen(false);
        setFormData({ username: "", password: "", email: "", role: "user" });
        setResponseModal({
          ...responseModal,
          open: true,
          title: "Success",
          message: "User added successfully",
          btnConfirm: false,
          success: true,
        });
      }
    } catch (error) {
      setResponseModal({
        ...responseModal,
        open: true,
        title: "Error",
        message:
          (error as any)?.response?.data?.message || "Failed to add user",
        btnConfirm: false,
        success: false,
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header title={"User Management"} />
      <div className="mx-auto p-4 md:p-6 w-full max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">System Users</h2>
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[#00A16A] text-white px-4 py-2 rounded-md hover:bg-[#008755] transition-colors flex items-center gap-2"
            aria-label="Add User"
          >
            <AddIcon fontSize="small" />
            Add User
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-center border border-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A16A]"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#00A16A] text-white">
                  <tr>
                    <th className="p-3 text-left font-medium">Username</th>
                    <th className="p-3 text-left font-medium">Email</th>
                    <th className="p-3 text-left font-medium">Role</th>
                    <th className="p-3 text-left font-medium">Created At</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">{formatDate(user.createdAt)}</td>
                      <td className="p-3 flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-[#00A16A] hover:text-[#008755] flex items-center gap-1"
                          aria-label={`Edit ${user.username}`}
                        >
                          <EditIcon fontSize="small" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setResponseModal({
                              ...responseModal,
                              open: true,
                              title: "Confirm Deletion",
                              message: `Are you sure you want to delete ${user.username}?`,
                              success: false,
                              btnConfirm: true,
                              btnLabel2: "Delete",
                              btnLabel: "Cancel",
                              onConfirm: () => handleDelete(user.id),
                              onClose: handleResponseCloseModal,
                            });
                          }}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <DeleteIcon fontSize="small" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        aria-labelledby="add-user-modal"
        className="flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              Add New User
            </h3>
            <button
              onClick={() => setAddModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
              >
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#00A16A] rounded-md hover:bg-[#008755]"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-user-modal"
        className="flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>
            <button
              onClick={() => setEditModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <CloseIcon />
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A16A]"
              >
                <option value="user">User</option>
                {/* <option value="admin">Admin</option> */}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#00A16A] rounded-md hover:bg-[#008755]"
              >
                Save Changes
              </button>
            </div>
          </form>
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

export default Users;
