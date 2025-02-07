"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../utils/Apis";
import { login, loadUser } from "../libs/features/authSlice";

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
    <div className="container mx-auto p-4">
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/4 lg:w-1/4 border-[#123962] border">
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Welcome to Mattrack!</h3>
            </div>

            {/* Email Input */}
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="text-green-500 text-sm">{successMessage}</div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            {/* Submit Button */}
            <div className="text-right">
            <button
                type="submit"
                className="text-[#123962] px-4 py-2 rounded hover:text-[#0e2c4f]"
                onClick={()=> {router.push("/appdata");}}
              >
                Continue as Guest
              </button>
              <button
                type="submit"
                className={`bg-[#123962] text-white px-4 py-2 rounded hover:bg-[#0e2c4f] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
