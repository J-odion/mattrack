"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterUser } from "../utils/Apis";
import { useDispatch, useSelector } from "react-redux";
import {  login } from "../libs/features/authSlice";

const RegisterStaff = ({ toggleForm }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: ""
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = ["admin", "viewer", "storekeepers", "engineers", "projectManager"];

  const auth = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (auth?.user && auth.user.isVerified === false) {
      router.push("/verifyotp");
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

    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      setErrorMessage("Kindly complete the form before submitting");
      return;
    }

    setLoading(true);

  try {
    const response = await RegisterUser(formData);
    dispatch(login({ user: response }));
    console.log(user)
    setSuccessMessage("User creation successful! Redirecting...");
    setTimeout(() => {
      router.push("/verifyotp");
    }, 1000);
  } catch (error) {
    setErrorMessage(error.message || "Invalid email or password, or an error occurred.");
    console.error("Error during registration:", error);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="container  p-4">
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/4 lg:w border-[#123962] border">
          <h2 className="text-2xs font-bold mb-4">Create a New Staff</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                Welcome to Mattrack!
              </h3>
            </div>

            {/* Name Input */}
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>

            {/* Role Input */}
            <div>
              <label className="block mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
              >
                <option value="">Select your role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
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

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            {/* Submit Button */}
            <div className="text-right">
              <button
                type="button"
                onClick={toggleForm}
                className="bg-white border border-[#123962] text-[#123962] px-4 py-2 rounded mr-2 hover:bg-[#123962] hover:text-white "
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-[#123962] text-white px-4 py-2 rounded hover:bg-[#0e2c4f] ${loading ? "opacity-50 cursor-not-allowed" : ""
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
  );
};

export default RegisterStaff;