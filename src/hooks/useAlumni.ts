/**
 * useAlumni Hook
 * Fetches the public alumni list for the homepage section
 */

import { useState, useCallback, useEffect } from "react";
import type { AlumniSummary } from "../api/member/alumni.api";
import { getAlumni } from "../api/member/alumni.api";

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return "An unexpected error occurred";
};

interface UseAlumniReturn {
  alumni: AlumniSummary[];
  loading: boolean;
  error: string | null;
  fetchAlumni: () => Promise<void>;
}

export const useAlumni = (): UseAlumniReturn => {
  const [alumni, setAlumni] = useState<AlumniSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAlumni();
      setAlumni(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  return { alumni, loading, error, fetchAlumni };
};
