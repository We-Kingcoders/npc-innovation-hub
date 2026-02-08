/**
 * Profile API Service
 *
 * Handles all profile-related API calls including:
 * - Fetching user profile
 * - Updating profile information
 * - Changing password
 */

import apiClient from "./client";
import type { User } from "../types/user.types";

// ==================== TYPE DEFINITIONS ====================

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  image?: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ProfileApiResponse {
  status: string;
  data: {
    user: User;
  };
}

export interface UpdateProfileResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

export interface UpdatePasswordResponse {
  status: string;
  message: string;
}

// ==================== PROFILE SERVICE ====================

export const profileService = {
  /**
   * Get current user profile
   * @returns User profile data
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ProfileApiResponse>("/api/users/me");
    return response.data.data.user;
  },

  /**
   * Update user profile
   * @param payload - Profile fields to update
   * @returns Updated user data
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const response = await apiClient.patch<UpdateProfileResponse>(
      "/api/users/update-profile",
      payload,
    );
    return response.data.data.user;
  },

  /**
   * Update user password
   * @param userId - User ID
   * @param payload - Old and new passwords
   * @returns Success message
   */
  async updatePassword(
    userId: string,
    payload: UpdatePasswordPayload,
  ): Promise<string> {
    const response = await apiClient.patch<UpdatePasswordResponse>(
      `/api/users/${userId}/update-password`,
      payload,
    );
    return response.data.message;
  },
};
