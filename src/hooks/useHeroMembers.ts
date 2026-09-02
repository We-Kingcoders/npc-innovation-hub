/**
 * useHeroMembers Hook
 * Fetches admin-curated hero members for the public landing page
 */

import { useState, useCallback, useEffect } from "react";
import type { HeroMember } from "../types/heroMember.types";
import { getHeroMembers } from "../api/member/heroMembers.api";

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return "An unexpected error occurred";
};

interface UseHeroMembersReturn {
  members: HeroMember[];
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
}

export const useHeroMembers = (): UseHeroMembersReturn => {
  const [members, setMembers] = useState<HeroMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHeroMembers();
      setMembers(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, fetchMembers };
};
