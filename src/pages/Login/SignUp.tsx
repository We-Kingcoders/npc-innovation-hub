import { useState } from "react";

const SignUpPage = () => {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeTerms: "",
  });

  // Simple email regex for demonstration
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      agreeTerms: "",
    };
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to terms and conditions.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Here you can send `firstName`, `lastName`, `email`, `password` to your API
      console.log("Sign Up submitted:", {
        firstName,
        lastName,
        email,
        password,
        agreeTerms,
      });
      // Optionally reset form:
      // setFirstName('');
      // setLastName('');
      // setEmail('');
      // setPassword('');
      // setAgreeTerms(false);
      // setErrors({ firstName: '', lastName: '', email: '', password: '', agreeTerms: '' });
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen"
      style={{ backgroundColor: "#002B56" }}
    >
      {/* Left Side Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-36 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold leading-tight">
            <span className="text-white " style={{ color: "#000000" }}>
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
          <h2 className="text-2xl font-semibold mb-6">Welcome!</h2>

          <p className="text-sm mb-4 max-w-sm leading-relaxed">
            To get started, create an account or log in. You can use your email
            address and password, or sign in quickly with Google, LinkedIn or
            GitHub.
          </p>

          <p className="text-sm max-w-sm leading-relaxed">
            If you already have an account, click the{" "}
            <span className="text-cyan-400 font-medium">
              “Forgot password?”
            </span>{" "}
            to recover your account.
          </p>
        </div>
      </div>

      {/* Right Side – Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-8 py-12">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <form onSubmit={handleSubmit} noValidate>
            <h1 className="text-2xl font-semibold text-[#002B56] text-center mb-6">
              Create an Account
            </h1>

            {/* First Name */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Firstname"
                className={`w-full px-4 py-3 border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Lastname"
                className={`w-full px-4 py-3 border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
                I agree to terms and conditions
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mb-4 text-sm text-red-500">{errors.agreeTerms}</p>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-medium transition duration-200 mb-4 ${
                agreeTerms
                  ? "bg-[#ECE9E9] text-[#002B56] hover:bg-gray-200"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!agreeTerms}
            >
              Sign Up
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center mb-4">
              <hr className="w-full border-gray-300" />
              <span className="px-2 text-gray-400">or</span>
              <hr className="w-full border-gray-300" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-3 mb-3 hover:bg-gray-50 transition duration-200"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* LinkedIn & GitHub */}
            <div className="flex space-x-3 mb-6">
              <button
                type="button"
                className="flex-1 flex items-center justify-center bg-white border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#0A66C2"
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                  />
                </svg>
                <span className="ml-2 text-sm text-[#002B56]">LinkedIn</span>
              </button>

              <button
                type="button"
                className="flex-1 flex items-center justify-center bg-white border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#333333"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
                <span className="ml-2 text-sm text-[#002B56]">GitHub</span>
              </button>
            </div>

            {/* Already have account? */}
            <div className="text-center">
              <span className="text-gray-600 text-[#002B56]">
                Already have an account?{" "}
              </span>
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
