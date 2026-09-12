// src/hooks/useProfile.ts

import { useState, useCallback } from "react";
import { profileService } from "../services/profile.service";
import type {
  UserProfile,
  UpdateProfilePayload,
  UpdatePasswordPayload,
} from "../types/profile.types";

// `profileService` calls go through `api/client.ts`, whose response
// interceptor already unwraps axios errors into a plain
// `{ message, statusCode, error }` object before this ever runs - so `err`
// here never actually has a `.response` (that's already been consumed) and
// isn't an `Error` instance either. The old checks below only recognized
// those two shapes, so every real backend message silently fell through to
// the generic fallback. Checking for a plain `.message` string covers the
// interceptor's shape and both of the previous ones (a raw axios error and
// a native Error both have `.message` too), so this replaces all three.
const extractMessage = (err: unknown): string => {
  if (err && typeof err === "object") {
    const withResponse = err as { response?: { data?: { message?: string } } };
    if (withResponse.response?.data?.message) {
      return withResponse.response.data.message;
    }
    const withMessage = err as { message?: unknown };
    if (typeof withMessage.message === "string" && withMessage.message) {
      return withMessage.message;
    }
  }
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
