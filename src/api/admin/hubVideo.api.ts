// src/api/admin/hubVideo.api.ts

import apiClient, { handleApiError } from "../client";
import { HUB_VIDEO_ROUTES } from "../routes";
import type {
  HubVideo,
  HubVideoResponse,
  UploadHubVideoResponse,
} from "../../types/hubVideo.types";

export const getAdminHubVideo = async (): Promise<HubVideo | null> => {
  try {
    const response = await apiClient.get<HubVideoResponse>(
      HUB_VIDEO_ROUTES.GET_HUB_VIDEO,
    );
    return response.data.data.video;
  } catch (error) {
    throw new Error(`Failed to fetch hub video: ${handleApiError(error)}`);
  }
};

export const uploadHubVideo = async (
  formData: FormData,
  onUploadProgress?: (percent: number) => void,
): Promise<HubVideo> => {
  // See applicationService.ts for why this cast is needed: the legacy
  // `@types/axios` stub doesn't know about `onUploadProgress`, but it's a
  // genuine, supported axios option at runtime.
  const requestConfig: Record<string, unknown> = {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onUploadProgress
      ? (event: { loaded: number; total?: number }) => {
          if (event.total) {
            onUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        }
      : undefined,
  };

  try {
    const response = await apiClient.post<UploadHubVideoResponse>(
      HUB_VIDEO_ROUTES.UPLOAD_HUB_VIDEO,
      formData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestConfig as any,
    );
    return response.data.data.video;
  } catch (error) {
    throw new Error(`Failed to upload hub video: ${handleApiError(error)}`);
  }
};

export const deleteHubVideo = async (): Promise<void> => {
  try {
    await apiClient.delete(HUB_VIDEO_ROUTES.DELETE_HUB_VIDEO);
  } catch (error) {
    throw new Error(`Failed to delete hub video: ${handleApiError(error)}`);
  }
};
