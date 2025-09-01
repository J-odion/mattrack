"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../utils/Apis";
import { login, loadUser } from "../libs/features/authSlice";
import { FaLock } from "react-icons/fa";
import { LuMail } from "react-icons/lu";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load user data on mount
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Redirect if already logged in
  useEffect(() => {
    if (auth.user) {
      router.push("/appdata");
    }
  }, [auth.user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.email || !formData.password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await loginUser(formData);

      dispatch(login({ token, user }));
      setSuccessMessage("Login successful! Redirecting...");

      // Wait a bit before redirecting to allow the success message to show
      setTimeout(() => {
        router.push("/appdata");
      }, 1000); // 1 second delay before redirecting
    } catch (error) {
      setErrorMessage("Invalid email or password, or an error occurred.");
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-[#123962]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#123962]">Login</h2>
          <h3 className="text-lg sm:text-xl font-semibold text-center mt-2">Welcome to Mattrack!</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <div className="mt-1 flex items-center gap-3 rounded-md border border-gray-300 bg-[#F2F4F6] px-3 py-2">
              <LuMail className="text-[#123962] text-lg" />
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <div className="mt-1 flex items-center gap-3 rounded-md border border-gray-300 bg-[#F2F4F6] px-3 py-2">
              <FaLock className="text-[#123962] text-lg" />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="text-green-600 text-sm text-center">{successMessage}</div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-600 text-sm text-center">{errorMessage}</div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              type="button"
              className="text-[#e73434] text-sm hover:text-[#0e2c4f] transition-colors"
              onClick={() => router.push("/forgetpassword")}
            >
              Forget Password
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                className="text-[#123962] px-4 py-2 rounded-md hover:bg-[#123962] hover:text-white transition-colors"
                onClick={() => router.push("/appdata")}
              >
                Continue as Guest
              </button>
              <button
                type="submit"
                className={`bg-[#123962] text-white px-4 py-2 rounded-md hover:bg-[#0e2c4f] transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;