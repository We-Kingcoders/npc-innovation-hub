// /**
//  * Forgot Password Component
//  *
//  * Allows users to request a password reset link via email.
//  * Place in: src/pages/Login/ForgotPassword.tsx
//  */

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";

// const ForgotPassword: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [localError, setLocalError] = useState("");

//   const navigate = useNavigate();
//   const { requestPasswordReset, error, isLoading, clearError } = useAuth();

//   // ==================== FORM SUBMISSION ====================

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLocalError("");
//     clearError();

//     if (!email) {
//       setLocalError("Please enter your email address.");
//       return;
//     }

//     try {
//       await requestPasswordReset({ email });
//       setIsSubmitted(true);
//     } catch (err: any) {
//       setLocalError(err.message);
//     }
//   };

//   const displayError = localError || error;

//   // ==================== SUCCESS VIEW ====================

//   if (isSubmitted) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="w-full max-w-md space-y-8">
//           <div className="text-center">
//             <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
//               <svg
//                 className="h-10 w-10 text-green-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h2 className="mt-6 text-3xl font-bold text-gray-900">
//               Check Your Email
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               We've sent a password reset link to <strong>{email}</strong>
//             </p>
//             <p className="mt-4 text-sm text-gray-600">
//               Click the link in the email to reset your password. If you don't
//               see the email, check your spam folder.
//             </p>
//           </div>

//           <div className="mt-8 space-y-4">
//             <button
//               onClick={() => navigate("/login")}
//               className="w-full py-3 px-4 bg-[#002B56] text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
//             >
//               Back to Login
//             </button>
//             <button
//               onClick={() => {
//                 setIsSubmitted(false);
//                 setEmail("");
//               }}
//               className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//             >
//               Try Another Email
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==================== FORM VIEW ====================

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Reset Your Password
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Enter your email address and we'll send you a link to reset your
//             password.
//           </p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           {displayError && (
//             <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-700 text-center text-sm">{displayError}</p>
//             </div>
//           )}

//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Email Address
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={isLoading}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//               placeholder="Enter your email"
//             />
//           </div>

//           <div className="space-y-4">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 px-4 bg-[#002B56] text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center">
//                   <svg
//                     className="animate-spin h-5 w-5 mr-3 text-white"
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
//                   Sending...
//                 </span>
//               ) : (
//                 "Send Reset Link"
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={() => navigate("/login")}
//               disabled={isLoading}
//               className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
//             >
//               Back to Login
//             </button>
//           </div>
//         </form>

//         {/* Additional Info */}
//         <div className="text-center">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{" "}
//             <a
//               href="/signup"
//               className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
//             >
//               Sign up here
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

/**
 * Forgot Password Component
 *
 * Allows users to request a password reset link via email.
 * Place in: src/pages/Login/ForgotPassword.tsx
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const { requestPasswordReset, error, isLoading, clearError } = useAuth();

  // ==================== FORM SUBMISSION ====================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!email) {
      setLocalError("Please enter your email address.");
      return;
    }

    try {
      await requestPasswordReset({ email });
      setIsSubmitted(true);
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const displayError = localError || error;

  // ==================== SUCCESS VIEW ====================

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Click the link in the email to reset your password. If you don't
              see the email, check your spam folder.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 px-4 bg-[#002B56] text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Back to Login
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Try Another Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== FORM VIEW ====================

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {displayError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center text-sm">{displayError}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#002B56] text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Back to Login
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
