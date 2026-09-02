/**
 * useHubVideo Hook
 * Fetches the admin-uploaded hub intro video for the public landing page
 */

import { useState, useCallback, useEffect } from "react";
import type { HubVideo } from "../types/hubVideo.types";
import { getHubVideo } from "../api/member/hubVideo.api";

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }
  return "An unexpected error occurred";
};

interface UseHubVideoReturn {
  video: HubVideo | null;
  loading: boolean;
  error: string | null;
  fetchVideo: () => Promise<void>;
}

export const useHubVideo = (): UseHubVideoReturn => {
  const [video, setVideo] = useState<HubVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getHubVideo();
      setVideo(result);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return { video, loading, error, fetchVideo };
};
