import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CredentialResponse } from "@react-oauth/google";

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

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
                "http://localhost:5000/api/users/auth/google/auth",
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
      const response = await fetch(
        "https://npc-innovation-hub-bn.onrender.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

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
    <div className="flex h-screen" style={{ backgroundColor: "#002B56" }}>
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center px-36">
        <div className="mb-8">
          <h1 className="text-4xl font-bold leading-tight">
            <span style={{ color: "#000000" }}>Innovate. </span>
            <span className="text-cyan-400">Create.</span>
            <br />
            <span className="text-cyan-400" style={{ color: "#029DE0" }}>
              Lead.
            </span>
          </h1>
        </div>
        <div className="text-white">
          <h2 className="text-2xl font-semibold mb-6">Welcome Back!</h2>
          <p className="text-sm mb-4 max-w-sm leading-relaxed">
            You can log in with email & password, or sign in quickly with
            Google.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center px-8">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-xl font-semibold text-[#002B56] text-center mb-6">
              Login to your Account
            </h1>
            {errorMessage && (
              <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#ECE9E9] text-[#002B56] rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center text-sm text-[#002B56]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2"
                  disabled={isLoading}
                />
                Remember me!
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="text-center text-[#002B56] py-2">OR</div>
            <div id="google-login-btn" className="w-full mb-3"></div>
            <div className="text-center pt-4">
              <span className="text-[#002B56]">Not yet account? </span>
              <a
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
