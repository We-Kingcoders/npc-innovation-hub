/**
 * Hub Video API Service
 * Public, unauthenticated: the admin-uploaded intro video for the landing page.
 */

import apiClient from "../client";
import type { HubVideo, HubVideoResponse } from "../../types/hubVideo.types";

const HUB_VIDEO_ROUTE = "/api/hub-video";

/**
 * Get the admin-uploaded hub intro video, or null if none has been
 * uploaded yet (a normal state, not an error).
 *
 * Unwraps defensively: the exact response envelope wasn't confirmed against
 * the live backend when this was written, so this accepts the standard
 * `{ data: { video } }` shape this codebase otherwise uses, plus a couple
 * of reasonable fallbacks.
 */
export const getHubVideo = async (): Promise<HubVideo | null> => {
  const response = await apiClient.get<HubVideoResponse>(HUB_VIDEO_ROUTE);
  const data = response.data;

  if (data?.data && "video" in data.data) {
    return data.data.video;
  }

  const loose = data as unknown as {
    video?: HubVideo | null;
    videoUrl?: string;
  };

  if (loose && "video" in loose) {
    return loose.video ?? null;
  }

  if (loose?.videoUrl) {
    return loose as unknown as HubVideo;
  }

  return null;
};
