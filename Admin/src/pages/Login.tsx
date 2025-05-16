import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../components/utils/apiRequest";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// Define interface for the user data based on the provided response
interface UserData {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  role: string;
  createdAt: string;
  chatIDs: string[];
}

interface LoginProps {
  onLogin: (user: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      const { username, password } = formData;

      if (!username.trim() || !password) {
        setError("Please fill in all fields.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest.post<UserData>("/auth/login", {
          username,
          password,
        });

        const user = response.data;

        if (response.status === 200 && user) {
          // Store user data in localStorage
          // localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(user));

          if (user.role === "admin") {
            onLogin(user);
            navigate("/dashboard", { replace: true });
          } else {
            setError("Access restricted to admin users.");
            localStorage.clear();
          }
        } else {
          setError("Login failed. Please try again.");
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          "An error occurred. Please try again later.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onLogin, navigate]
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-gray-800 to-green-700 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-300 mt-2">Sign in to access your account</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-center border border-red-200 dark:border-red-800"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-700 text-white placeholder-gray-400"
                placeholder="Enter your username"
                autoComplete="username"
                required
                aria-invalid={!!error}
                aria-describedby={error ? "username-error" : undefined}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-700 text-white placeholder-gray-400"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                aria-invalid={!!error}
                aria-describedby={error ? "password-error" : undefined}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00A16A] text-white py-3 px-4 rounded-lg hover:bg-[#008755] focus:outline-none focus:ring-2 focus:ring-[#00A16A] focus:ring-offset-2 transition duration-200 font-medium flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
