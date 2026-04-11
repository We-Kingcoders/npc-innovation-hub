// src/services/profile.service.ts

import client from "../api/client";
import type {
  UserProfile,
  UpdateProfilePayload,
  UpdatePasswordPayload,
  UserProfileResponse,
  UserMeResponse,
} from "../types/profile.types";

export const profileService = {
  /** GET /api/users/profile */
  getProfile: async (): Promise<UserProfile> => {
    const res = await client.get<UserProfileResponse>("/api/users/profile");
    return res.data.data;
  },

  /** GET /api/users/me */
  getMe: async (): Promise<UserProfile> => {
    const res = await client.get<UserMeResponse>("/api/users/me");
    return res.data.data.user;
  },

  /** PATCH /api/users/update-profile */
  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<UserProfile> => {
    const res = await client.patch<UserProfileResponse>(
      "/api/users/update-profile",
      payload,
    );
    return res.data.data;
  },

  /** PATCH /api/users/{id}/update-password */
  updatePassword: async (
    userId: string,
    payload: UpdatePasswordPayload,
  ): Promise<void> => {
    await client.patch(`/api/users/${userId}/update-password`, payload);
  },
};
