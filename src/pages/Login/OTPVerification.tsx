// import React, { useState } from "react";
// import { useAuth } from "../../hooks/useAuth";

// const OTPVerification: React.FC = () => {
//   const [otp, setOtp] = useState("");
//   const [localError, setLocalError] = useState("");
//   const [showSecurityTips, setShowSecurityTips] = useState(false);

//   // Use authentication context
//   const { verifyOTP, user, error, isLoading, clearError } = useAuth();

//   const email = user?.email || localStorage.getItem("email") || "";

//   // ==================== OTP VERIFICATION ====================

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLocalError("");
//     clearError();

//     // Validation
//     if (!otp) {
//       setLocalError("Please enter the OTP.");
//       return;
//     }

//     if (!email) {
//       setLocalError("Email is missing. Please try logging in again.");
//       return;
//     }

//     try {
//       // Use auth context for OTP verification
//       await verifyOTP({ email, otp });
//       // Navigation is handled by AuthContext based on user role
//     } catch (err: any) {
//       // Error is already set in context, but we can display it locally too
//       setLocalError(err.message);
//     }
//   };

//   // Display error from either local state or auth context
//   const displayError = localError || error;

//   return (
//     <div className="flex h-screen" style={{ backgroundColor: "#002B56" }}>
//       {/* Left Side Content */}
//       <div className="w-1/2 flex flex-col justify-center px-36">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold leading-tight">
//             <span className="text-white">Innovate. </span>
//             <span className="text-cyan-400">Create.</span>
//             <br />
//             <span className="text-cyan-400" style={{ color: "#029DE0" }}>
//               Lead.
//             </span>
//           </h1>
//         </div>
//         <div className="text-white">
//           <h2 className="text-2xl font-semibold mb-6">OTP Verification</h2>
//           <p className="text-sm mb-4 max-w-sm leading-relaxed">
//             Enter the OTP sent to <span className="font-semibold">{email}</span>{" "}
//             to verify your account and continue.
//           </p>
//           <div className="text-sm max-w-sm leading-relaxed">
//             <span
//               className="text-cyan-400 font-medium cursor-pointer hover:underline"
//               onClick={() => setShowSecurityTips(true)}
//             >
//               Security Tips
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Right Side - OTP Form */}
//       <div className="w-1/2 flex items-center justify-center px-8">
//         <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <h1 className="text-xl font-semibold text-[#002B56] text-center mb-6">
//               OTP Verification
//             </h1>

//             {displayError && (
//               <div className="mb-2 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
//                 {displayError}
//               </div>
//             )}

//             <div>
//               <label className="block text-gray-700 text-sm font-medium mb-2">
//                 Enter OTP Code
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter 6-digit OTP"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 maxLength={6}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 backgroundColor: "#ECE9E9",
//                 color: "#002B56",
//               }}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin h-5 w-5 mr-3"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Verifying...
//                 </span>
//               ) : (
//                 "Verify OTP"
//               )}
//             </button>

//             <div className="text-center pt-4">
//               <p className="text-sm text-gray-600">
//                 Didn't receive the code?{" "}
//                 <button
//                   type="button"
//                   className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
//                   disabled={isLoading}
//                   onClick={() => {
//                     // You can implement resend OTP functionality here
//                     alert("Resend OTP functionality coming soon!");
//                   }}
//                 >
//                   Resend OTP
//                 </button>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Security Tips Popup */}
//       {showSecurityTips && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
//             <div className="border-b border-gray-200 py-4 px-6">
//               <h1 className="text-xl font-bold text-red-500 flex items-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="#e74c3c"
//                   className="mr-2"
//                 >
//                   <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
//                 </svg>
//                 SECURITY TIPS
//               </h1>
//             </div>
//             <div className="py-4 px-6">
//               <p className="mb-3">
//                 To ensure your account security, please follow these steps when
//                 logging in:
//               </p>
//               <ol className="list-decimal pl-6 space-y-2">
//                 <li>Fill in your email and password</li>
//                 <li>Click on the login button</li>
//                 <li>
//                   You'll receive an OTP (One-Time Password) containing
//                   verification digits via email
//                 </li>
//                 <li>Enter that OTP in the provided form</li>
//                 <li>
//                   If you don't have an account, click on the register/signup
//                   link
//                 </li>
//                 <li>
//                   After registering, you'll receive a verification link to
//                   verify your email
//                 </li>
//               </ol>
//               <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">
//                   <strong>Important:</strong> Never share your OTP with anyone.
//                   The Hub team will never ask for your OTP.
//                 </p>
//               </div>
//             </div>
//             <div className="border-t border-gray-200 py-3 px-6 flex justify-center">
//               <button
//                 className="py-2 px-10 bg-blue-900 text-white font-bold rounded hover:bg-blue-800 transition-colors"
//                 onClick={() => setShowSecurityTips(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OTPVerification;

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
    <div className="flex h-screen" style={{ backgroundColor: "#002B56" }}>
      {/* Left Side Content */}
      <div className="w-1/2 flex flex-col justify-center px-36">
        <div className="mb-8">
          <h1 className="text-4xl font-bold leading-tight">
            <span className="text-white">Innovate. </span>
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
            Enter the OTP sent to <span className="font-semibold">{email}</span>{" "}
            to verify your account and continue.
          </p>
          <div className="text-sm max-w-sm leading-relaxed">
            <span
              className="text-cyan-400 font-medium cursor-pointer hover:underline"
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

            {displayError && (
              <div className="mb-2 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {displayError}
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter OTP Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#ECE9E9",
                color: "#002B56",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
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

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
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
