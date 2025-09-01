"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { loadUser } from "../libs/features/authSlice";

const ChangePassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing reset token");
      setTimeout(() => {
        router.push("/forget-password");
      }, 3000);
    }
  }, [token, router]);

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
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to reset password");
      }

      setSuccessMessage("Password reset successful! Redirecting to login...");
      dispatch(loadUser());
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message || "Failed to reset password");
      console.error("Error during password reset:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/4 lg:w-1/3 border-[#123962] border">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Set New Password</h3>
              <p className="text-sm text-gray-600">
                Enter your new password below.
              </p>
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="New password"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="Confirm new password"
                required
              />
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 text-sm">{successMessage}</div>
            )}

            <div className="text-right">
              <button
                type="submit"
                className={`bg-[#123962] text-white px-4 py-2 rounded hover:bg-[#0e2c4f] ${
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
  );
};

export default ChangePassword;