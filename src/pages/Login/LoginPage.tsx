// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [localError, setLocalError] = useState("");

//   const navigate = useNavigate();

//   // Use authentication context
//   const { login, error, isLoading, clearError } = useAuth();

//   // ==================== FORM SUBMISSION ====================

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLocalError("");
//     clearError();

//     // Validation
//     if (!email || !password) {
//       setLocalError("Please enter both email and password.");
//       return;
//     }

//     try {
//       // Use auth context for login
//       await login({ email, password });
//       // Navigation to OTP is handled by AuthContext
//     } catch (err: any) {
//       // Error is already set in context, but we can display it locally too
//       setLocalError(err.message);
//     }
//   };

//   // Placeholder handler for Google Sign-In (to be implemented later)
//   const handleGoogleSignIn = () => {
//     // TODO: Implement Google Sign-In logic here
//     console.log("Google Sign-In clicked - Integration pending");
//     setLocalError("Google Sign-In will be integrated soon!");
//   };

//   // Display error from either local state or auth context
//   const displayError = localError || error;

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header Section */}
//       <header className="bg-white shadow-sm py-4">
//         <div className="container mx-auto px-6">
//           <div className="flex items-center justify-between">
//             {/* Logo */}
//             <div className="text-2xl font-bold text-gray-800">
//               NpcInnovationHub
//             </div>

//             {/* Navigation Links */}
//             <nav>
//               <ul className="flex space-x-8 items-center">
//                 <li>
//                   <a
//                     href="/"
//                     className="text-blue-700 hover:text-blue-800 transition-colors duration-200 font-medium"
//                     style={{ color: "#0175C3" }}
//                   >
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/about"
//                     className="text-gray-600 hover:text-blue-700 transition-colors duration-200 font-medium"
//                     style={{ color: "#0175C3" }}
//                   >
//                     About Hub
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/members"
//                     className="text-gray-600 hover:text-blue-700 transition-colors duration-200 font-medium"
//                     style={{ color: "#0175C3" }}
//                   >
//                     Members
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/projects"
//                     className="text-gray-600 hover:text-blue-700 transition-colors duration-200 font-medium"
//                     style={{ color: "#0175C3" }}
//                   >
//                     Projects
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Two Column Layout */}
//       <div className="flex flex-1">
//         {/* Left Side - Image Background with Text Overlay */}
//         <div className="w-1/2 relative">
//           {/* Image Background */}
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage:
//                 "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
//             }}
//           >
//             {/* Dark Overlay for Better Text Contrast */}
//             <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
//           </div>

//           {/* Content Container - Text Overlay */}
//           <div className="relative z-10 h-full flex items-center p-12">
//             <div className="max-w-lg text-white">
//               {/* Prewritten Words with Enhanced Visibility */}
//               <div className="mb-10">
//                 <h1 className="text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
//                   <span className="text-white">Innovate. </span>
//                   <span className="text-cyan-300">Create.</span>
//                   <br />
//                   <span className="text-cyan-400">Lead.</span>
//                 </h1>
//                 <h2 className="text-3xl font-semibold mb-6 drop-shadow-md">
//                   Welcome Back!
//                 </h2>
//                 <p className="text-xl leading-relaxed drop-shadow-md backdrop-blur-sm bg-white/10 p-4 rounded-lg">
//                   You can log in with email & password, or sign in quickly with
//                   Google. Join our community of innovators shaping the future
//                   together.
//                 </p>
//               </div>

//               {/* Feature Highlights */}
//               <div className="mt-12 space-y-6">
//                 <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
//                   <div className="mr-4">
//                     <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
//                       <span className="text-white text-xl">🚀</span>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold">Innovate Together</h3>
//                     <p className="text-gray-200">
//                       Collaborate with like-minded creators
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
//                   <div className="mr-4">
//                     <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
//                       <span className="text-white text-xl">💡</span>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold">Create Solutions</h3>
//                     <p className="text-gray-200">
//                       Build projects that make a difference
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
//                   <div className="mr-4">
//                     <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
//                       <span className="text-white text-xl">👥</span>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold">Lead Communities</h3>
//                     <p className="text-gray-200">
//                       Inspire and guide fellow innovators
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Maximized Login Card */}
//         <div
//           className="w-1/2 flex items-center justify-center p-12"
//           style={{ backgroundColor: "#002B56" }}
//         >
//           <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-2xl">
//             <form onSubmit={handleSubmit} className="space-y-8">
//               <div className="text-center mb-10">
//                 <h1 className="text-3xl font-bold text-[#002B56] mb-4">
//                   Login to your Account
//                 </h1>
//                 <p className="text-gray-600">
//                   Access your dashboard and continue your innovation journey
//                 </p>
//               </div>

//               {displayError && (
//                 <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
//                   <p className="text-red-700 text-center">{displayError}</p>
//                 </div>
//               )}

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-gray-700 text-sm font-medium mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     placeholder="Enter your email address"
//                     className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 text-sm font-medium mb-2">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     placeholder="Enter your password"
//                     className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-4 bg-[#002B56] text-white rounded-xl font-semibold text-lg hover:bg-blue-800 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin h-5 w-5 mr-3 text-white"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                         fill="none"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Logging in...
//                   </span>
//                 ) : (
//                   "Login"
//                 )}
//               </button>

//               <div className="flex justify-between items-center pt-4">
//                 <label className="flex items-center text-gray-700">
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={() => setRememberMe(!rememberMe)}
//                     className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//                     disabled={isLoading}
//                   />
//                   <span className="ml-2 text-lg">Remember me</span>
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => navigate("/forgot-password")}
//                   className="text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium"
//                   disabled={isLoading}
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               <div className="relative py-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center">
//                   <span className="px-4 bg-white text-gray-500 text-lg">
//                     OR CONTINUE WITH
//                   </span>
//                 </div>
//               </div>

//               {/* Google Sign-In Button Placeholder */}
//               <button
//                 type="button"
//                 onClick={handleGoogleSignIn}
//                 className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-lg font-medium text-gray-700"
//                 disabled={isLoading}
//               >
//                 <svg
//                   className="w-6 h-6"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     fill="#4285F4"
//                   />
//                   <path
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     fill="#34A853"
//                   />
//                   <path
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     fill="#FBBC05"
//                   />
//                   <path
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     fill="#EA4335"
//                   />
//                 </svg>
//                 Sign in with Google
//               </button>

//               <div className="text-center pt-8 border-t border-gray-200">
//                 <p className="text-gray-600 text-lg">
//                   Don't have an account?{" "}
//                   <a
//                     href="/signup"
//                     className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
//                   >
//                     Sign up here
//                   </a>
//                 </p>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  // Use authentication context
  const { login, error, isLoading, clearError } = useAuth();

  // ==================== FORM SUBMISSION ====================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    // Validation
    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    try {
      // Use auth context for login
      await login({ email, password });
      // Navigation to OTP is handled by AuthContext
    } catch (err: unknown) {
      // Error is already set in context, but we can display it locally too
      setLocalError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Placeholder handler for Google Sign-In (to be implemented later)
  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In logic here
    console.log("Google Sign-In clicked - Integration pending");
    setLocalError("Google Sign-In will be integrated soon!");
  };

  // Display error from either local state or auth context
  const displayError = localError || error;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl font-bold text-gray-800">
              NpcInnovationHub
            </div>

            {/* Navigation Links */}
            <nav>
              <ul className="flex space-x-8 items-center">
                <li>
                  <a
                    href="/"
                    className="text-blue-700 hover:text-blue-800 transition-colors duration-200 font-medium"
                    style={{ color: "#0175C3" }}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                    style={{ color: "#0175C3" }}
                  >
                    About Hub
                  </a>
                </li>
                <li>
                  <a
                    href="/members"
                    className="text-gray-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                    style={{ color: "#0175C3" }}
                  >
                    Members
                  </a>
                </li>
                <li>
                  <a
                    href="/projects"
                    className="text-gray-600 hover:text-blue-700 transition-colors duration-200 font-medium"
                    style={{ color: "#0175C3" }}
                  >
                    Projects
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

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
              {/* Prewritten Words with Enhanced Visibility */}
              <div className="mb-10">
                <h1 className="text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
                  <span className="text-white">Innovate. </span>
                  <span className="text-cyan-300">Create.</span>
                  <br />
                  <span className="text-cyan-400">Lead.</span>
                </h1>
                <h2 className="text-3xl font-semibold mb-6 drop-shadow-md">
                  Welcome Back!
                </h2>
                <p className="text-xl leading-relaxed drop-shadow-md backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                  You can log in with email & password, or sign in quickly with
                  Google. Join our community of innovators shaping the future
                  together.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">🚀</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Innovate Together</h3>
                    <p className="text-gray-200">
                      Collaborate with like-minded creators
                    </p>
                  </div>
                </div>

                <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">💡</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Create Solutions</h3>
                    <p className="text-gray-200">
                      Build projects that make a difference
                    </p>
                  </div>
                </div>

                <div className="flex items-center backdrop-blur-sm bg-white/10 p-4 rounded-lg">
                  <div className="mr-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">👥</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Lead Communities</h3>
                    <p className="text-gray-200">
                      Inspire and guide fellow innovators
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Maximized Login Card */}
        <div
          className="w-1/2 flex items-center justify-center p-12"
          style={{ backgroundColor: "#002B56" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-[#002B56] mb-4">
                  Login to your Account
                </h1>
                <p className="text-gray-600">
                  Access your dashboard and continue your innovation journey
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              <div className="flex justify-between items-center pt-4">
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-lg">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-600 hover:text-blue-800 hover:underline text-lg font-medium"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-gray-500 text-lg">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button Placeholder */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-lg font-medium text-gray-700"
                disabled={isLoading}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className="text-center pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-lg">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                  >
                    Sign up here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
