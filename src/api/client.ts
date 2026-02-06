/**
 * API Client Configuration
 *
 * Centralized Axios instance with:
 * - Base URL configuration from environment
 * - JWT token injection
 * - Request/Response interceptors
 * - Centralized error handling
 */

import axios from "axios";

// ==================== TYPES ====================

interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

// ==================== API CLIENT INSTANCE ====================

/**
 * Create and configure the main API client
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== REQUEST INTERCEPTOR ====================

/**
 * Add JWT token to all requests
 * Automatically injects the auth token from localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Create headers object if it doesn't exist
      if (!config.headers) {
        config.headers = {};
      }
      // Set Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==================== RESPONSE INTERCEPTOR ====================

/**
 * Handle responses and errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response data
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          console.error("Unauthorized access. Redirecting to login...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;

        case 403:
          // Forbidden - Insufficient permissions
          console.error("Access forbidden:", data?.message);
          break;

        case 404:
          // Not found
          console.error("Resource not found:", data?.message);
          break;

        case 422:
          // Validation error
          console.error("Validation error:", data?.message);
          break;

        case 500:
          // Server error
          console.error("Server error:", data?.message);
          break;

        default:
          console.error("API error:", data?.message || "An error occurred");
      }

      // Return structured error
      return Promise.reject({
        message: data?.message || "An error occurred",
        statusCode: status,
        error: data?.error,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error: No response from server");
      return Promise.reject({
        message: "Network error. Please check your connection.",
        statusCode: 0,
      });
    } else {
      // Something else happened
      console.error("Request error:", error.message);
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        statusCode: 0,
      });
    }
  },
);

// ==================== EXPORTS ====================

export default apiClient;

/**
 * Helper function to handle API errors consistently
 */
export const handleApiError = (error: unknown): string => {
  // Check if it's an axios error by checking for response property
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: ApiErrorResponse } };
    return axiosError.response?.data?.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
