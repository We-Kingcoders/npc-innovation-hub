import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CredentialResponse } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID, API_BASE_URL } from "../../config/env";
import Navbar from "../../components/Navbar";

// Extend the Window interface to include typed google object
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: object) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-gsi-script";
      document.body.appendChild(script);
      script.onload = () => {
        waitForGoogleScript();
      };
    } else {
      waitForGoogleScript();
    }

    function waitForGoogleScript(tries = 0): void {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: CredentialResponse) => {
            const tokenId = response.credential;

            // Debug: decode JWT payload
            const parts = tokenId?.split(".");
            if (parts?.length === 3) {
              const decoded = JSON.parse(atob(parts[1]));
              console.log("Decoded Google JWT payload:", decoded);
            }

            try {
              const res = await fetch(
                // Was hardcoded to the production onrender.com URL, which
                // meant this specifically worked in production but broke
                // local dev - now uses the same env-driven base URL as the
                // rest of the app instead of a URL that's only ever right
                // for one environment.
                `${API_BASE_URL}/api/users/auth/google/auth`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ tokenId }),
                },
              );
              const data = await res.json();
              if (!res.ok) {
                setErrorMessage(data.message || "Google login failed.");
                return;
              }

              if (data.data && data.data.user) {
                localStorage.setItem("email", data.data.user.email);
                localStorage.setItem("role", data.data.user.role);
              }
              localStorage.setItem("token", data.token);
              setErrorMessage("");
              navigate("/otp");
            } catch {
              setErrorMessage("Failed to login with Google.");
            }
          },
        });

        const googleBtnDiv = document.getElementById("google-login-btn");
        if (googleBtnDiv) {
          window.google.accounts.id.renderButton(googleBtnDiv, {
            theme: "outline",
            size: "large",
            width: "100%",
          });
          window.google.accounts.id.prompt();
        } else {
          setErrorMessage("Google button div not found!");
        }
      } else if (tries < 50) {
        setTimeout(() => waitForGoogleScript(tries + 1), 100);
      } else {
        setErrorMessage("Google script failed to load.");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // Was hardcoded to http://localhost:5000 - the actual, literal login
      // form submission was unreachable from the real deployed site (a
      // user's browser has no way to reach "their own machine's port
      // 5000"), only ever working by coincidence during local dev.
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.message || "Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      const token = data?.token;
      const role = data?.data?.user?.role;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        setErrorMessage("");
        navigate("/otp");
      } else {
        setErrorMessage("Token not received. Login failed.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message.includes("Failed to fetch")
            ? "Network error. Please check your connection."
            : "An unexpected error occurred.",
        );
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header Section - was its own hand-rolled header with a broken
          "About Hub" link (/about doesn't exist - the real route is
          /Hub-information), plain <a> tags that force a full page reload
          on every click instead of client-side navigation, and no mobile
          menu at all. The shared Navbar already solves all three and is
          what every other public route uses (including /signup, right
          next to this page) - no reason this one page needed its own. */}
      <Navbar />

      {/* Main Content - Two Column Layout. h-screen + overflow-hidden on the
          root above, plus overflow-y-auto on the form column below, mean
          the page itself never scrolls on any device - only the form
          column scrolls internally if its content is ever taller than the
          space left. Was a bare flex with two w-1/2 columns and no
          responsive fallback - on any phone or narrow tablet this squeezed
          the background panel and the login form into two illegible
          half-width columns instead of stacking. */}
      <main
        id="main-content"
        className="flex flex-col md:flex-row flex-1 min-h-0"
      >
        {/* Left Side - just the photo, full-bleed, on every device - no
            text overlay now, so no contrast/legibility concerns either. */}
        <div
          className="h-40 sm:h-56 md:h-auto md:w-1/2 flex-shrink-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/assets/images/hubimage.jpg')",
          }}
          role="img"
          aria-label="NPC Innovation Hub members collaborating"
        />

        {/* Right Side - Maximized Login Card. overflow-y-auto lets this
            column scroll on its own if the form is taller than the space
            left after the (now much shorter, image-only) left panel,
            instead of the whole page scrolling. */}
        <div
          className="flex-1 md:w-1/2 min-h-0 overflow-y-auto flex items-center justify-center p-6 sm:p-12"
          style={{ backgroundColor: "#002B56" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-12 w-full max-w-2xl my-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-[#002B56] mb-4">
                  Login to your Account
                </h1>
                <p className="text-gray-600">
                  Access your dashboard and continue your innovation journey
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-center">{errorMessage}</p>
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
                className="w-full py-4 bg-[#002B56] text-white rounded-xl font-semibold text-lg hover:bg-blue-800 transition-colors duration-200 shadow-lg"
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

              <div id="google-login-btn" className="w-full"></div>

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
      </main>
    </div>
  );
};

export default LoginPage;
