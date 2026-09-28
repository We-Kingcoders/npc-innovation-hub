/**
 * useHeroMedia Hook
 * Fetches admin-curated hero media for the public homepage hero background.
 */

import { useState, useCallback, useEffect } from "react";
import type { HeroMedia } from "../types/heroMedia.types";
import { getHeroMedia } from "../api/heroMedia.api";

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return "An unexpected error occurred";
};

// Mirrors useHeroMembers.ts: a visitor can already be on the homepage
// when an admin changes hero media elsewhere - background polling picks
// that up without requiring a manual refresh. Neither consumer reads
// `loading`, so a background refetch never causes a visible flicker.
const POLL_INTERVAL_MS = 15_000;

interface UseHeroMediaReturn {
  media: HeroMedia[];
  loading: boolean;
  error: string | null;
  fetchMedia: () => Promise<void>;
}

export const useHeroMedia = (): UseHeroMediaReturn => {
  const [media, setMedia] = useState<HeroMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHeroMedia();
      setMedia(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();

    const timer = setInterval(() => {
      if (document.hidden) return;
      fetchMedia();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [fetchMedia]);

  return { media, loading, error, fetchMedia };
};
