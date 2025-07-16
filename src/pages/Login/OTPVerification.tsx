import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // Not needed, using fetch for consistency with LoginPage

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurityTips, setShowSecurityTips] = useState(false);

  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";

  // Handles OTP verification
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp) {
      setErrorMessage("Please enter the OTP.");
      return;
    }
    if (!email) {
      setErrorMessage("Email is missing. Please try logging in again.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      // Use fetch for consistency with LoginPage
      const response = await fetch(
        "https://npc-innovation-hub-bn.onrender.com/api/users/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );
      const data = await response.json();

      if (response.ok && data.message === "OTP verified successfully") {
        // Optionally, store a token if the backend returns it
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        // Navigate based on role (use same logic as in LoginPage)
        switch (role) {
          case "Member":
            navigate("/dashboard");
            break;
          case "Admin":
            navigate("/Admindashboard");
            break;
          default:
            setErrorMessage(`Invalid role: ${role}`);
            break;
        }
      } else {
        setErrorMessage(
          data.message || "OTP verification failed. Please try again.",
        );
      }
      // ...rest of the code above...
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: string }).message === "string"
      ) {
        setErrorMessage(
          (error as { message?: string }).message?.includes("Failed to fetch")
            ? "Network error. Please check your connection."
            : "An unexpected error occurred.",
        );
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#002B56" }}>
      {/* Left Side Content */}
      <div className="w-1/2 flex flex-col justify-center px-36">
        <div className="mb-8">
          <h1 className="text-4xl font-bold leading-tight">
            <span className="text-white" style={{ color: "#000000" }}>
              Innovate.{" "}
            </span>
            <span className="text-cyan-400">Create.</span>
            <br />
            <span className="text-cyan-400" style={{ color: "#029DE0" }}>
              Lead.
            </span>
          </h1>
        </div>
        <div className="text-white">
          <h2 className="text-2xl font-semibold mb-6">OTP Verification</h2>
          <p className="text-sm mb-4 max-w-sm leading-relaxed">
            Enter the OTP sent to your email to verify your account and
            continue.
          </p>
          <div className="text-sm max-w-sm leading-relaxed">
            <span
              className="text-cyan-400 font-medium cursor-pointer"
              onClick={() => setShowSecurityTips(true)}
            >
              Security Tips
            </span>
          </div>
        </div>
      </div>
      {/* Right Side - OTP Form */}
      <div className="w-1/2 flex items-center justify-center px-8">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-xl font-semibold text-[#002B56] text-center mb-6">
              OTP Verification
            </h1>
            {errorMessage && (
              <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium transition duration-200"
              style={{
                backgroundColor: "#ECE9E9",
                color: "#002B56",
                opacity: isLoading ? 0.7 : 1,
              }}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
      {/* Security Tips Popup */}
      {showSecurityTips && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="border-b border-gray-200 py-4 px-6">
              <h1 className="text-xl font-bold text-red-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#e74c3c"
                  className="mr-2"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
                SECURITY TIPS
              </h1>
            </div>
            <div className="py-4 px-6">
              <p className="mb-3">
                In order to ensure your account security, please follow these
                steps when logging in:
              </p>
              <ol className="list-decimal pl-6">
                <li className="mb-2">Fill your email and password</li>
                <li className="mb-2">Click on login button</li>
                <li className="mb-2">
                  You get OTP contains verification digits on your email
                </li>
                <li className="mb-2">Put that OTP in provided form</li>
                <li className="mb-2">
                  If you don't have an account then click on register
                </li>
                <li className="mb-2">
                  After registering you get a verification link to verify your
                  email
                </li>
              </ol>
            </div>
            <div className="border-t border-gray-200 py-3 px-6 flex justify-center">
              <button
                className="py-2 px-10 bg-blue-900 text-white font-bold rounded"
                onClick={() => setShowSecurityTips(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
