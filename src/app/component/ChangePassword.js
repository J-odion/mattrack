"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { loadUser } from "../libs/features/authSlice";
import { resetPassword } from "../utils/Apis";

const ChangePasswordContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setNotification({ message: "Invalid or missing reset token", type: "error" });
      setTimeout(() => {
        router.push("/forget-password");
      }, 3000);
    }
  }, [token, router]);

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
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", type: "" });

    if (!password || !confirmPassword) {
      setNotification({ message: "Please fill in both password fields", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setNotification({ message: "Passwords do not match", type: "error" });
      return;
    }

    if (password.length < 8) {
      setNotification({ message: "Password must be at least 8 characters long", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const credentials = { token, password };
      await resetPassword(credentials);
      setNotification({ message: "Password reset successful! Redirecting to login...", type: "success" });
      dispatch(loadUser());
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setNotification({ message: error.message || "Failed to reset password", type: "error" });
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
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#123962]">Change Password</h2>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Set New Password</h3>
            <p className="text-sm text-gray-600 mb-4">Enter your new password below.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">New Password *</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded-md w-full text-sm bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChangePassword = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-600">Loading...</div>}>
      <ChangePasswordContent />
    </Suspense>
  );
};

export default ChangePassword;