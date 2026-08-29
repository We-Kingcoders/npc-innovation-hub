/**
 * useApplications Hooks
 * Custom hooks for admin review of membership applications
 */

import { useState, useCallback, useEffect } from "react";
import type {
  MembershipApplication,
  ApplicationStatus,
  RejectApplicationPayload,
} from "../types/application.types";
import {
  getApplications,
  getApplication,
  acceptApplication,
  rejectApplication,
} from "../api/admin/application.api";

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return "An unexpected error occurred";
};

// ==================== MUTATION RESULT TYPES ====================

export type MutationErrorKind = "conflict" | "server";

export type MutationResult =
  | { ok: true; application: MembershipApplication }
  | { ok: false; kind: MutationErrorKind; message: string };

/**
 * Turn an apiClient rejection into a UI-actionable result.
 * 409 means someone else already decided this application (refresh and
 * look again); anything else means nothing changed on the backend and the
 * admin can safely retry.
 */
export const classifyMutationError = (error: unknown): MutationResult => {
  const apiErr = error as { statusCode?: number; message?: string };
  const message = apiErr?.message || "Something went wrong. Please try again.";
  if (apiErr?.statusCode === 409) {
    return { ok: false, kind: "conflict", message };
  }
  return { ok: false, kind: "server", message };
};

export type StatusFilter = ApplicationStatus | "All";

// ==================== LIST HOOK ====================

interface UseApplicationsReturn {
  applications: MembershipApplication[];
  loading: boolean;
  error: string | null;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  fetchApplications: () => Promise<void>;
}

/**
 * Hook for managing the applications list, filtered by status server-side
 */
export const useApplications = (
  initialStatus: StatusFilter = "Pending",
): UseApplicationsReturn => {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getApplications(
        statusFilter === "All" ? undefined : statusFilter,
      );
      setApplications(response.data.applications);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  return {
    applications,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    fetchApplications,
  };
};

// ==================== DETAIL HOOK ====================

interface UseApplicationReturn {
  application: MembershipApplication | null;
  loading: boolean;
  error: string | null;
  fetchApplication: () => Promise<void>;
  handleAccept: () => Promise<MutationResult>;
  handleReject: (payload?: RejectApplicationPayload) => Promise<MutationResult>;
}

/**
 * Hook for managing a single application, including the accept/reject
 * decisions. Fetches on mount and whenever `id` changes.
 */
export const useApplication = (id: string): UseApplicationReturn => {
  const [application, setApplication] = useState<MembershipApplication | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getApplication(id);
      setApplication(response.data.application);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleAccept = useCallback(async (): Promise<MutationResult> => {
    try {
      const response = await acceptApplication(id);
      setApplication(response.data.application);
      return { ok: true, application: response.data.application };
    } catch (err) {
      return classifyMutationError(err);
    }
  }, [id]);

  const handleReject = useCallback(
    async (payload?: RejectApplicationPayload): Promise<MutationResult> => {
      try {
        const response = await rejectApplication(id, payload);
        setApplication(response.data.application);
        return { ok: true, application: response.data.application };
      } catch (err) {
        return classifyMutationError(err);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  return {
    application,
    loading,
    error,
    fetchApplication,
    handleAccept,
    handleReject,
  };
};
