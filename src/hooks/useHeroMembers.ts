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

// A visitor can already be on the homepage when an admin adds or
// reorders a hero member elsewhere - without this, they'd only ever see
// that change by refreshing the page themselves. Neither consumer of
// this hook (HeroSection's carousel, HubMembersSection's grid) reads
// `loading` from here, so re-fetching in the background never causes a
// visible skeleton/flicker - it just quietly swaps `members` in once new
// data arrives.
const POLL_INTERVAL_MS = 15_000;

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

    const timer = setInterval(() => {
      // Skip the request while the tab is backgrounded - nothing is
      // watching the carousel, and it'll catch up on the next tick after
      // the visitor comes back.
      if (document.hidden) return;
      fetchMembers();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [fetchMembers]);

  return { members, loading, error, fetchMembers };
};
