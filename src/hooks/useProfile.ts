// src/hooks/useProfile.ts

import { useState, useCallback } from "react";
import { profileService } from "../services/profile.service";
import type {
  UserProfile,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from "../types/profile.types";

const extractMessage = (err: unknown): string => {
  if (err && typeof err === "object" && "response" in err) {
    const ax = err as { response?: { data?: { message?: string } } };
    return ax.response?.data?.message ?? "An error occurred";
  }
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred";
};

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMsg: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
  updatePassword: (
    userId: string,
    payload: UpdatePasswordPayload,
  ) => Promise<boolean>;
  clearMessages: () => void;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccess] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      // fallback to /me
      try {
        const data = await profileService.getMe();
        setProfile(data);
      } catch {
        setError(extractMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        const updated = await profileService.updateProfile(payload);
        setProfile(updated);
        setSuccess("Profile updated successfully!");
        return true;
      } catch (err) {
        setError(extractMessage(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const updatePassword = useCallback(
    async (
      userId: string,
      payload: UpdatePasswordPayload,
    ): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        await profileService.updatePassword(userId, payload);
        setSuccess("Password updated successfully!");
        return true;
      } catch (err) {
        setError(extractMessage(err));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return {
    profile,
    loading,
    saving,
    error,
    successMsg,
    fetchProfile,
    updateProfile,
    updatePassword,
    clearMessages,
  };
};
