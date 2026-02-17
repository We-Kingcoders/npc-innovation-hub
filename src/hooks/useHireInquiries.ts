/**
 * useHireInquiries Hooks
 * Custom hooks for hire inquiry management with state and API integration
 */

import { useState, useCallback, useEffect } from "react";
import type {
  HireInquiry,
  ReplyPayload,
  UpdateStatusPayload,
} from "../types/hire.types";
import {
  getHireInquiries,
  getHireInquiry,
  deleteHireInquiry,
  updateHireInquiryStatus,
  replyToInquiry,
} from "../api/admin/hire.api";

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

interface UseHireInquiriesReturn {
  inquiries: HireInquiry[];
  loading: boolean;
  error: string | null;
  fetchInquiries: () => Promise<void>;
  handleDelete: (id: string) => Promise<boolean>;
  handleUpdateStatus: (
    id: string,
    payload: UpdateStatusPayload,
  ) => Promise<boolean>;
  handleReply: (id: string, payload: ReplyPayload) => Promise<boolean>;
}

/**
 * Hook for managing all hire inquiries
 */
export const useHireInquiries = (): UseHireInquiriesReturn => {
  const [inquiries, setInquiries] = useState<HireInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHireInquiries();
      setInquiries(response.data.inquiries || []);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await deleteHireInquiry(id);
        // Optimistic update
        setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== id));
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error deleting inquiry:", err);
        await fetchInquiries(); // Revert on error
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchInquiries],
  );

  const handleUpdateStatus = useCallback(
    async (id: string, payload: UpdateStatusPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await updateHireInquiryStatus(id, payload);
        await fetchInquiries(); // Refresh list
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error updating status:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchInquiries],
  );

  const handleReply = useCallback(
    async (id: string, payload: ReplyPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await replyToInquiry(id, payload);
        await fetchInquiries(); // Refresh list
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error sending reply:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchInquiries],
  );

  return {
    inquiries,
    loading,
    error,
    fetchInquiries,
    handleDelete,
    handleUpdateStatus,
    handleReply,
  };
};

interface UseHireInquiryReturn {
  inquiry: HireInquiry | null;
  loading: boolean;
  error: string | null;
  fetchInquiry: () => Promise<void>;
  handleUpdateStatus: (payload: UpdateStatusPayload) => Promise<boolean>;
  handleReply: (payload: ReplyPayload) => Promise<boolean>;
  handleDelete: () => Promise<boolean>;
}

/**
 * Hook for managing a single hire inquiry
 */
export const useHireInquiry = (id: string): UseHireInquiryReturn => {
  const [inquiry, setInquiry] = useState<HireInquiry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiry = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getHireInquiry(id);
      setInquiry(response.data.inquiry);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error fetching inquiry:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleUpdateStatus = useCallback(
    async (payload: UpdateStatusPayload): Promise<boolean> => {
      if (!id) return false;

      setLoading(true);
      setError(null);
      try {
        const response = await updateHireInquiryStatus(id, payload);
        setInquiry(response.data.inquiry);
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error updating status:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  const handleReply = useCallback(
    async (payload: ReplyPayload): Promise<boolean> => {
      if (!id) return false;

      setLoading(true);
      setError(null);
      try {
        await replyToInquiry(id, payload);
        await fetchInquiry(); // Refresh data
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error sending reply:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [id, fetchInquiry],
  );

  const handleDelete = useCallback(async (): Promise<boolean> => {
    if (!id) return false;

    setLoading(true);
    setError(null);
    try {
      await deleteHireInquiry(id);
      return true;
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error deleting inquiry:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInquiry();
  }, [fetchInquiry]);

  return {
    inquiry,
    loading,
    error,
    fetchInquiry,
    handleUpdateStatus,
    handleReply,
    handleDelete,
  };
};
