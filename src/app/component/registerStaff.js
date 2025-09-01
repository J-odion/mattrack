"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterUser } from "../utils/Apis";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../libs/features/authSlice";

const RegisterStaff = ({ toggleForm }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
  });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const roles = [
    "admin",
    "viewer",
    "storekeepers",
    "engineers",
    "account",
    "projectEngineer",
    "projectManager",
  ];

  const auth = useSelector((state) => state.auth);

  // Redirect if already logged in and not verified
  useEffect(() => {
    if (auth?.user && auth.user.isVerified === false) {
      router.push("/verifyotp");
    }
  }, [auth.user, router]);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", type: "" });

    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      setNotification({ message: "Please complete all required fields.", type: "error" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setNotification({ message: "Please enter a valid email address.", type: "error" });
      return;
    }

    // Basic password validation (e.g., minimum length)
    if (formData.password.length < 6) {
      setNotification({ message: "Password must be at least 6 characters long.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await RegisterUser(formData);
      dispatch(login({ user: response }));
      setNotification({ message: "User creation successful! Redirecting...", type: "success" });
      setTimeout(() => {
        router.push("/verifyotp");
        toggleForm();
      }, 1000);
    } catch (error) {
      setNotification({
        message: error.message || "Failed to create user. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification.message && (
          <div
            className={`fixed z-50 top-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg border border-[#123962]">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#123962]">Create a New Staff</h2>
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-700">
              Welcome to Mattrack!
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  required
                />
              </div>

              {/* Role Input */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role} value={role} className="capitalize">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email Input */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="border border-[#123962] text-[#123962] px-4 py-2 rounded-md text-sm hover:bg-[#123962] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#123962]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Adding User..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStaff;