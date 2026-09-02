/**
 * Hub Video Type Definitions
 * Admin-uploaded intro video shown on the public landing page.
 * Matches GET /api/hub-video.
 */

export interface HubVideo {
  videoUrl: string;
  title?: string;
  description?: string;
}

export interface HubVideoResponse {
  status: string;
  data: {
    video: HubVideo | null;
  };
}
