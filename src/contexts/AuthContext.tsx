// /**
//  * Authentication Context
//  *
//  * Provides global authentication state and methods throughout the application.
//  * Manages user login, logout, and authentication status.
//  * Place in: src/contexts/AuthContext.tsx (REPLACE existing)
//  */

// import React, { createContext, useState, useEffect } from "react";
// import type { ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
// import { authService } from "../api/authService";
// import type {
//   LoginCredentials,
//   GoogleAuthPayload,
//   OTPVerificationPayload,
//   PasswordResetRequestPayload,
//   PasswordResetPayload,
// } from "../api/authService";

// // ==================== TYPE DEFINITIONS ====================

// export interface User {
//   email: string;
//   role: string;
//   name?: string;
//   id?: string;
// }

// export interface AuthContextType {
//   // State
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;

//   // Methods
//   login: (credentials: LoginCredentials) => Promise<void>;
//   loginWithGoogle: (payload: GoogleAuthPayload) => Promise<void>;
//   verifyOTP: (payload: OTPVerificationPayload) => Promise<void>;
//   logout: () => Promise<void>;
//   requestPasswordReset: (payload: PasswordResetRequestPayload) => Promise<void>;
//   resetPassword: (payload: PasswordResetPayload) => Promise<void>;
//   clearError: () => void;
// }

// // ==================== CONTEXT CREATION ====================

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined,
// );

// // ==================== PROVIDER COMPONENT ====================

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const navigate = useNavigate();

//   // ==================== INITIALIZATION ====================

//   /**
//    * Initialize auth state from localStorage on mount
//    */
//   useEffect(() => {
//     const initializeAuth = () => {
//       try {
//         const currentUser = authService.getCurrentUser();

//         if (currentUser.token && currentUser.email) {
//           setUser({
//             email: currentUser.email,
//             role: currentUser.role || "Member",
//           });
//           setIsAuthenticated(true);
//         } else {
//           setUser(null);
//           setIsAuthenticated(false);
//         }
//       } catch (err) {
//         console.error("Auth initialization error:", err);
//         setUser(null);
//         setIsAuthenticated(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   // ==================== AUTHENTICATION METHODS ====================

//   /**
//    * Login with email and password
//    * After successful login, user will be redirected to OTP verification
//    */
//   const login = async (credentials: LoginCredentials): Promise<void> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await authService.login(credentials);

//       // Set user data but don't mark as fully authenticated yet (pending OTP)
//       setUser({
//         email: response.data.user.email,
//         role: response.data.user.role,
//         name: response.data.user.name,
//         id: response.data.user.id,
//       });

//       // Navigate to OTP verification
//       navigate("/otp");
//     } catch (err: any) {
//       const errorMessage =
//         err.message || "Login failed. Please check your credentials.";
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Login with Google OAuth
//    * After successful login, user will be redirected to OTP verification
//    */
//   const loginWithGoogle = async (payload: GoogleAuthPayload): Promise<void> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await authService.googleAuth(payload);

//       // Set user data but don't mark as fully authenticated yet (pending OTP)
//       setUser({
//         email: response.data.user.email,
//         role: response.data.user.role,
//         name: response.data.user.name,
//         id: response.data.user.id,
//       });

//       // Navigate to OTP verification
//       navigate("/otp");
//     } catch (err: any) {
//       const errorMessage = err.message || "Google login failed.";
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Verify OTP code
//    * After successful verification, user is fully authenticated and redirected to dashboard
//    */
//   const verifyOTP = async (payload: OTPVerificationPayload): Promise<void> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await authService.verifyOTP(payload);

//       if (response.message === "OTP verified successfully") {
//         // Mark user as fully authenticated
//         setIsAuthenticated(true);

//         // Navigate based on user role
//         const role = authService.getUserRole();
//         switch (role) {
//           case "Member":
//             navigate("/dashboard");
//             break;
//           case "Admin":
//             navigate("/Admindashboard");
//             break;
//           default:
//             navigate("/dashboard");
//             break;
//         }
//       } else {
//         throw new Error("OTP verification failed");
//       }
//     } catch (err: any) {
//       const errorMessage =
//         err.message || "OTP verification failed. Please try again.";
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Request password reset email
//    */
//   const requestPasswordReset = async (
//     payload: PasswordResetRequestPayload,
//   ): Promise<void> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       await authService.requestPasswordReset(payload);
//     } catch (err: any) {
//       const errorMessage =
//         err.message || "Failed to send password reset email.";
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Reset password using token
//    */
//   const resetPassword = async (
//     payload: PasswordResetPayload,
//   ): Promise<void> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       await authService.resetPassword(payload);
//       // Navigate to login after successful password reset
//       navigate("/login");
//     } catch (err: any) {
//       const errorMessage = err.message || "Failed to reset password.";
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Logout user and clear all authentication data
//    */
//   const logout = async (): Promise<void> => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       await authService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//       navigate("/login");
//     } catch (err: any) {
//       console.error("Logout error:", err);
//       // Still clear local state even if API call fails
//       setUser(null);
//       setIsAuthenticated(false);
//       navigate("/login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Clear error state
//    */
//   const clearError = (): void => {
//     setError(null);
//   };

//   // ==================== CONTEXT VALUE ====================

//   const value: AuthContextType = {
//     user,
//     isAuthenticated,
//     isLoading,
//     error,
//     login,
//     loginWithGoogle,
//     verifyOTP,
//     logout,
//     requestPasswordReset,
//     resetPassword,
//     clearError,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

/**
 * Authentication Context
 *
 * Provides global authentication state and methods throughout the application.
 * Manages user login, logout, and authentication status.
 * Place in: src/contexts/AuthContext.tsx (REPLACE existing)
 */

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

// ==================== TYPE DEFINITIONS ====================

export interface User {
  email: string;
  role: string;
  name?: string;
  id?: string;
}

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

  // ==================== INITIALIZATION ====================

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();

        if (currentUser.token && currentUser.email) {
          setUser({
            email: currentUser.email,
            role: currentUser.role || "Member",
          });
          setIsAuthenticated(true);
        } else {
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
      const response = await authService.login(credentials);

      // Set user data but don't mark as fully authenticated yet (pending OTP)
      setUser({
        email: response.data.user.email,
        role: response.data.user.role,
        name: response.data.user.name,
        id: response.data.user.id,
      });

      // Navigate to OTP verification
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
      const response = await authService.googleAuth(payload);

      // Set user data but don't mark as fully authenticated yet (pending OTP)
      setUser({
        email: response.data.user.email,
        role: response.data.user.role,
        name: response.data.user.name,
        id: response.data.user.id,
      });

      // Navigate to OTP verification
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
        // Mark user as fully authenticated
        setIsAuthenticated(true);

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
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err: unknown) {
      console.error("Logout error:", err);
      // Still clear local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
