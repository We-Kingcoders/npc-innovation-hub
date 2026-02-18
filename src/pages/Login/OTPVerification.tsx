import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const [showSecurityTips, setShowSecurityTips] = useState(false);

  // Use authentication context
  const { verifyOTP, user, error, isLoading, clearError } = useAuth();

  const email = user?.email || localStorage.getItem("email") || "";

  // ==================== OTP VERIFICATION ====================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    // Validation
    if (!otp) {
      setLocalError("Please enter the OTP.");
      return;
    }

    if (!email) {
      setLocalError("Email is missing. Please try logging in again.");
      return;
    }

    try {
      // Use auth context for OTP verification
      await verifyOTP({ email, otp });
      // Navigation is handled by AuthContext based on user role
    } catch (err: unknown) {
      // Error is already set in context, but we can display it locally too
      setLocalError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Display error from either local state or auth context
  const displayError = localError || error;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content - Two Column Layout */}
      <div className="flex flex-1">
        {/* Left Side - Image Background with Text Overlay */}
        <div className="w-1/2 relative">
          {/* Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
            }}
          >
            {/* Dark Overlay for Better Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          </div>

          {/* Content Container - Text Overlay */}
          <div className="relative z-10 h-full flex items-center p-12">
            <div className="max-w-lg text-white">
              {/* Heading */}
              <div className="mb-10">
                <h1 className="text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
                  <span className="text-white">Innovate. </span>
                  <span className="text-cyan-300">Create.</span>
                  <br />
                  <span className="text-cyan-400">Lead.</span>
                </h1>
                <h2 className="text-3xl font-semibold mb-6 drop-shadow-md">
                  OTP Verification
                </h2>
                <p className="text-xl leading-relaxed drop-shadow-md backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                  Enter the OTP sent to{" "}
                  <span className="font-semibold">{email}</span> to verify your
                  account and continue.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🔒</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Secure Access</h3>
                    <p className="text-gray-200">
                      Two-factor authentication keeps your account safe
                    </p>
                  </div>
                </div>

                <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">✉️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Check Your Email</h3>
                    <p className="text-gray-200">
                      A 6-digit code was sent to your inbox
                    </p>
                  </div>
                </div>

                <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🛡️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Never Share OTPs</h3>
                    <p className="text-gray-200">
                      Our team will never ask for your verification code
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Tips Link */}
              <div className="mt-8">
                <span
                  className="text-cyan-400 font-medium cursor-pointer hover:underline text-sm"
                  onClick={() => setShowSecurityTips(true)}
                >
                  View Security Tips →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - OTP Form */}
        <div
          className="w-1/2 flex items-center justify-center p-12"
          style={{ backgroundColor: "#002B56" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-[#002B56] mb-4">
                  OTP Verification
                </h1>
                <p className="text-gray-600">
                  Enter the 6-digit code sent to your email address
                </p>
              </div>

              {displayError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-center">{displayError}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-widest text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#002B56] text-white rounded-xl font-semibold text-lg hover:bg-blue-800 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-lg">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                    disabled={isLoading}
                    onClick={() => {
                      // You can implement resend OTP functionality here
                      alert("Resend OTP functionality coming soon!");
                    }}
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </form>
          </div>
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
                To ensure your account security, please follow these steps when
                logging in:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Fill in your email and password</li>
                <li>Click on the login button</li>
                <li>
                  You'll receive an OTP (One-Time Password) containing
                  verification digits via email
                </li>
                <li>Enter that OTP in the provided form</li>
                <li>
                  If you don't have an account, click on the register/signup
                  link
                </li>
                <li>
                  After registering, you'll receive a verification link to
                  verify your email
                </li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Never share your OTP with anyone.
                  The Hub team will never ask for your OTP.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 py-3 px-6 flex justify-center">
              <button
                className="py-2 px-10 bg-blue-900 text-white font-bold rounded hover:bg-blue-800 transition-colors"
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
