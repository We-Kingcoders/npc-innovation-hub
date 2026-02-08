import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/authService";
import type {
  LoginCredentials,
  GoogleAuthPayload,
  OTPVerificationPayload,
  PasswordResetRequestPayload,
  PasswordResetPayload,
} from "../api/authService";
import type { User } from "../types/user.types";

// ==================== TYPE DEFINITIONS ====================

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Methods
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: (payload: GoogleAuthPayload) => Promise<void>;
  verifyOTP: (payload: OTPVerificationPayload) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (payload: PasswordResetRequestPayload) => Promise<void>;
  resetPassword: (payload: PasswordResetPayload) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// ==================== CONTEXT CREATION ====================

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ==================== PROVIDER COMPONENT ====================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Fetch and set user profile from backend
   */
  const fetchUserProfile = async (): Promise<void> => {
    try {
      const userProfile: User = await authService.fetchCurrentUser();

      // Set the user directly from the API response
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // Clear auth data if fetch fails (invalid token)
      authService.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // ==================== INITIALIZATION ====================

  /**
   * Initialize auth state from localStorage on mount
   * If token exists, fetch full user profile from backend
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();

        if (currentUser.token) {
          // Token exists, fetch full profile from backend
          await fetchUserProfile();
        } else {
          // No token, user is not authenticated
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ==================== AUTHENTICATION METHODS ====================

  /**
   * Login with email and password
   * After successful login, user will be redirected to OTP verification
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(credentials);

      // Navigate to OTP verification
      // User data will be fetched after OTP verification
      navigate("/otp");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with Google OAuth
   * After successful login, user will be redirected to OTP verification
   */
  const loginWithGoogle = async (payload: GoogleAuthPayload): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.googleAuth(payload);

      // Navigate to OTP verification
      // User data will be fetched after OTP verification
      navigate("/otp");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Google login failed.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify OTP code
   * After successful verification, user is fully authenticated and redirected to dashboard
   */
  const verifyOTP = async (payload: OTPVerificationPayload): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.verifyOTP(payload);

      if (response.message === "OTP verified successfully") {
        // Fetch full user profile from backend
        await fetchUserProfile();

        // Navigate based on user role
        const role = authService.getUserRole();
        switch (role) {
          case "Member":
            navigate("/dashboard");
            break;
          case "Admin":
            navigate("/Admindashboard");
            break;
          default:
            navigate("/dashboard");
            break;
        }
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "OTP verification failed. Please try again.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Request password reset email
   */
  const requestPasswordReset = async (
    payload: PasswordResetRequestPayload,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.requestPasswordReset(payload);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send password reset email.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset password using token
   */
  const resetPassword = async (
    payload: PasswordResetPayload,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(payload);
      // Navigate to login after successful password reset
      navigate("/login");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user and clear all authentication data
   * Calls backend logout endpoint, clears state, and redirects to login
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call backend logout endpoint
      await authService.logout();
    } catch (err: unknown) {
      console.error("Logout error:", err);
      // Continue with local logout even if API fails
    } finally {
      // Clear user state
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);

      // Redirect to login
      navigate("/login");
    }
  };

  /**
   * Refresh user profile from backend
   * Useful after profile updates
   */
  const refreshUser = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchUserProfile();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh user profile.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setError(null);
  };

  // ==================== CONTEXT VALUE ====================

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    loginWithGoogle,
    verifyOTP,
    logout,
    requestPasswordReset,
    resetPassword,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
