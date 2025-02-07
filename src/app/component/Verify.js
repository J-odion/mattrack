"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Verifyotp } from "../utils/Apis";

const VerifyOTP = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const email = user?.email || "";
  
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp) {
      setErrorMessage("Validation error!");
      return;
    }

    setLoading(true);

    try {
      console.log("Request Payload:", { email, otp });
      const { user } = await Verifyotp({ email, otp });

      dispatch(loadUser({ user }));
      setSuccessMessage("Verification Successful! Redirecting...");

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      setErrorMessage("Verification failed: incorrect code");
      console.error("Error during verification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/4 lg:w-1/4 border-[#123962] border">
          <h2 className="text-2xs font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Verify OTP!</h3>
              <p className="text-xs">We have sent an OTP to your email {email}. It will expire in 15 mins.</p>
            </div>

            <div>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded w-full"
                required
              />
            </div>

            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

            <div className="text-right">
              <button
                type="button"
                className={`text-[#123962] px-4 py-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? " " : "Resend OTP"}
              </button>

              <button
                type="submit"
                className={`bg-[#123962] text-white px-4 py-2 rounded hover:bg-[#0e2c4f] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
