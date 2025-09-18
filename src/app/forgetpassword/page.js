"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loadUser } from "../libs/features/authSlice";
import AuthSideBar from "../component/AuthSideBar";

export default function Home(){
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("api/forgetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Something went wrong");
      }

      setSuccessMessage("Password reset email sent! Please check your inbox.");
      dispatch(loadUser());
    } catch (error) {
      setErrorMessage(error.message || "Failed to send reset email");
      console.error("Error during password reset request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-[100vh] bg-gray-100">
      <div className="flex h-full w-[50%]">
        <AuthSideBar />
      </div>
      <div className="w-full inset-0 flex justify-center items-center">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full md:w-2/4 lg:w-2.2/4 border-[#123962] border">
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Email</h3>
              <p className="text-sm text-gray-600">
                We'll send you a link to reset your password.
              </p>
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="Enter your email"
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
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

