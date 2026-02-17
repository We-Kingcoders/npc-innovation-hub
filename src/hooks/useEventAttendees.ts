/**
 * useEventAttendees Hook
 * Custom hook for managing event attendees
 */

import { useState, useCallback } from "react";
import type { Attendance } from "../types/event.types";
import { getEventAttendees } from "../api/admin/event.api";

// Error extraction helper
const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    if ("response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string };
        };
      };
      return (
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "An error occurred"
      );
    }
    if ("message" in error) {
      return (error as { message: string }).message;
    }
  }
  return "An unexpected error occurred";
};

interface UseEventAttendeesReturn {
  attendees: Attendance[];
  loading: boolean;
  error: string | null;
  fetchAttendees: (eventId: string) => Promise<void>;
}

export const useEventAttendees = (): UseEventAttendeesReturn => {
  const [attendees, setAttendees] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendees = useCallback(async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEventAttendees(eventId);
      setAttendees(response.data.attendances || []);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error fetching attendees:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    attendees,
    loading,
    error,
    fetchAttendees,
  };
};
