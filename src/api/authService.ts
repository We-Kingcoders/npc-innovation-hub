import type { User } from "../types/user.types";

const API_BASE_URL = "http://localhost:5000/api/users";

// ==================== TYPE DEFINITIONS ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  data: {
    user: {
      email: string;
      role: string;
      name?: string;
      id?: string;
    };
  };
  message?: string;
}

export interface GoogleAuthPayload {
  tokenId: string;
}

export interface OTPVerificationPayload {
  email: string;
  otp: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetPayload {
  token: string;
  newPassword: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// User type is imported from user.types.ts
// No need to redefine it here

// ==================== HELPER FUNCTIONS ====================

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || "Request failed",
        statusCode: response.status,
      } as ApiError;
    }

    return data;
  } catch (error) {
    // Network errors or JSON parsing errors
    if (error instanceof TypeError) {
      throw {
        message: "Network error. Please check your connection.",
        statusCode: 0,
      } as ApiError;
    }
    throw error;
  }
}

/**
 * Get authorization header with current token
 */
function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ==================== AUTHENTICATION SERVICE ====================

export const authService = {
  /**
   * Login with email and password
   *
   * @param credentials - User email and password
   * @returns Login response with token and user data
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Store authentication data
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("email", credentials.email);
      if (response.data?.user?.role) {
        localStorage.setItem("role", response.data.user.role);
      }
    }

    return response;
  },

  /**
   * Login with Google OAuth
   *
   * @param payload - Google tokenId from OAuth response
   * @returns Login response with token and user data
   */
  async googleAuth(payload: GoogleAuthPayload): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>("/auth/google/auth", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Store authentication data
    if (response.token) {
      localStorage.setItem("token", response.token);
      if (response.data?.user?.email) {
        localStorage.setItem("email", response.data.user.email);
      }
      if (response.data?.user?.role) {
        localStorage.setItem("role", response.data.user.role);
      }
    }

    return response;
  },

  /**
   * Verify OTP code
   *
   * @param payload - Email and OTP code
   * @returns Verification response
   */
  async verifyOTP(payload: OTPVerificationPayload): Promise<{
    message: string;
    token?: string;
  }> {
    const response = await apiRequest<{ message: string; token?: string }>(
      "/verify-otp",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    // Update token if provided
    if (response.token) {
      localStorage.setItem("token", response.token);
    }

    return response;
  },

  /**
   * Verify email address using verification token
   *
   * @param token - Verification token from email link
   * @returns Verification response
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `/verify-email?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
      },
    );
  },

  /**
   * Request password reset email
   *
   * @param payload - User email address
   * @returns Success message
   */
  async requestPasswordReset(
    payload: PasswordResetRequestPayload,
  ): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/request-password-reset", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Reset password using token from email
   *
   * @param payload - Reset token and new password
   * @returns Success message
   */
  async resetPassword(
    payload: PasswordResetPayload,
  ): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch current user profile from backend
   *
   * @returns User profile data
   * @throws Error if not authenticated or request fails
   */
  async fetchCurrentUser(): Promise<User> {
    const response = await apiRequest<{ data: { user: User } }>("/me", {
      method: "GET",
      headers: getAuthHeader(),
    });

    return response.data.user;
  },

  /**
   * Logout current user
   * Calls backend logout endpoint and clears local storage
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await apiRequest("/logout", {
        method: "POST",
        headers: getAuthHeader(),
      });
    } catch (error) {
      // Log error but continue with local logout
      console.error("Logout API error:", error);
    } finally {
      // Always clear local storage
      this.clearAuthData();
    }
  },

  /**
   * Clear all authentication data from local storage
   */
  clearAuthData(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  /**
   * Get current user data from local storage
   */
  getCurrentUser(): {
    email: string | null;
    role: string | null;
    token: string | null;
  } {
    return {
      email: localStorage.getItem("email"),
      role: localStorage.getItem("role"),
      token: localStorage.getItem("token"),
    };
  },

  /**
   * Get current user role
   */
  getUserRole(): string | null {
    return localStorage.getItem("role");
  },
};
