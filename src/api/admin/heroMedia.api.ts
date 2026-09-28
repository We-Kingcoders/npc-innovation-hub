// src/api/admin/heroMedia.api.ts

import apiClient, { handleApiError } from "../client";
import { HERO_MEDIA_ROUTES } from "../routes";
import type {
  AdminHeroMedia,
  AdminHeroMediaListResponse,
  AdminHeroMediaItemResponse,
} from "../../types/heroMedia.types";

export const getAdminHeroMedia = async (): Promise<AdminHeroMedia[]> => {
  try {
    const response = await apiClient.get<AdminHeroMediaListResponse>(
      HERO_MEDIA_ROUTES.GET_HERO_MEDIA,
    );
    return response.data.data.media;
  } catch (error) {
    throw new Error(`Failed to fetch hero media: ${handleApiError(error)}`);
  }
};

export const uploadHeroMedia = async (
  formData: FormData,
  onUploadProgress?: (percent: number) => void,
): Promise<AdminHeroMedia> => {
  // See hubVideo.api.ts / applicationService.ts for why this cast is
  // needed: the legacy @types/axios stub doesn't know about
  // onUploadProgress, but it's a genuine, supported axios option at runtime.
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
    const response = await apiClient.post<AdminHeroMediaItemResponse>(
      HERO_MEDIA_ROUTES.UPLOAD_HERO_MEDIA,
      formData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestConfig as any,
    );
    return response.data.data.media;
  } catch (error) {
    throw new Error(`Failed to upload hero media: ${handleApiError(error)}`);
  }
};

export const updateHeroMediaMetadata = async (
  id: string,
  updates: { title?: string; altText?: string; caption?: string },
): Promise<AdminHeroMedia> => {
  try {
    const response = await apiClient.patch<AdminHeroMediaItemResponse>(
      HERO_MEDIA_ROUTES.UPDATE_HERO_MEDIA(id),
      updates,
    );
    return response.data.data.media;
  } catch (error) {
    throw new Error(`Failed to update hero media: ${handleApiError(error)}`);
  }
};

export const activateHeroMedia = async (
  id: string,
): Promise<AdminHeroMedia> => {
  try {
    const response = await apiClient.patch<AdminHeroMediaItemResponse>(
      HERO_MEDIA_ROUTES.ACTIVATE_HERO_MEDIA(id),
    );
    return response.data.data.media;
  } catch (error) {
    throw new Error(`Failed to activate hero media: ${handleApiError(error)}`);
  }
};

export const deactivateHeroMedia = async (
  id: string,
): Promise<AdminHeroMedia> => {
  try {
    const response = await apiClient.patch<AdminHeroMediaItemResponse>(
      HERO_MEDIA_ROUTES.DEACTIVATE_HERO_MEDIA(id),
    );
    return response.data.data.media;
  } catch (error) {
    throw new Error(
      `Failed to deactivate hero media: ${handleApiError(error)}`,
    );
  }
};

export const setDefaultHeroMedia = async (
  id: string,
): Promise<AdminHeroMedia> => {
  try {
    const response = await apiClient.patch<AdminHeroMediaItemResponse>(
      HERO_MEDIA_ROUTES.SET_DEFAULT_HERO_MEDIA(id),
    );
    return response.data.data.media;
  } catch (error) {
    throw new Error(
      `Failed to set default hero media: ${handleApiError(error)}`,
    );
  }
};

export const reorderHeroMedia = async (
  orderedIds: string[],
): Promise<AdminHeroMedia[]> => {
  try {
    const response = await apiClient.patch<AdminHeroMediaListResponse>(
      HERO_MEDIA_ROUTES.REORDER_HERO_MEDIA,
      orderedIds,
    );
    return response.data.data.media;
  } catch (error) {
    throw new Error(`Failed to reorder hero media: ${handleApiError(error)}`);
  }
};

export const deleteHeroMedia = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(HERO_MEDIA_ROUTES.DELETE_HERO_MEDIA(id));
  } catch (error) {
    throw new Error(`Failed to delete hero media: ${handleApiError(error)}`);
  }
};
