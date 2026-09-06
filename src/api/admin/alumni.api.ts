// src/api/admin/alumni.api.ts

import apiClient, { handleApiError } from "../client";
import { ALUMNI_ROUTES } from "../routes";
import type {
  Alumni,
  AlumniResponse,
  AlumniListResponse,
  CreateAlumniPayload,
  UpdateAlumniPayload,
} from "../../types/alumni.types";

const toFormData = (
  payload: CreateAlumniPayload | UpdateAlumniPayload,
): FormData => {
  const fd = new FormData();
  if (payload.name !== undefined) fd.append("fullName", payload.name);
  if (payload.role !== undefined) fd.append("role", payload.role);
  if (payload.image) fd.append("image", payload.image);
  return fd;
};

// The backend stores and returns the name under `fullName` (matching what
// CREATE/UPDATE send), not `name` — normalize it here so the rest of the
// frontend can keep using the shorter `name` field consistently.
const normalizeAlumni = (raw: Alumni & { fullName?: string }): Alumni => ({
  ...raw,
  name: raw.fullName ?? raw.name,
});

export const setMemberAlumniStatus = async (
  memberId: string,
  isAlumni: boolean,
): Promise<void> => {
  try {
    await apiClient.patch(ALUMNI_ROUTES.SET_MEMBER_ALUMNI_STATUS(memberId), {
      isAlumni,
    });
  } catch (error) {
    throw new Error(`Failed to update alumni status: ${handleApiError(error)}`);
  }
};

export const getAlumniList = async (): Promise<Alumni[]> => {
  try {
    const response = await apiClient.get<AlumniListResponse>(
      ALUMNI_ROUTES.GET_ALUMNI,
    );
    return response.data.data.alumni.map(normalizeAlumni);
  } catch (error) {
    throw new Error(`Failed to fetch alumni: ${handleApiError(error)}`);
  }
};

export const createAlumni = async (
  payload: CreateAlumniPayload,
): Promise<Alumni> => {
  try {
    const response = await apiClient.post<AlumniResponse>(
      ALUMNI_ROUTES.CREATE_ALUMNI,
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return normalizeAlumni(response.data.data.alumni);
  } catch (error) {
    throw new Error(`Failed to create alumni entry: ${handleApiError(error)}`);
  }
};

export const updateAlumni = async (
  id: string,
  payload: UpdateAlumniPayload,
): Promise<Alumni> => {
  try {
    const response = await apiClient.patch<AlumniResponse>(
      ALUMNI_ROUTES.UPDATE_ALUMNI(id),
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return normalizeAlumni(response.data.data.alumni);
  } catch (error) {
    throw new Error(`Failed to update alumni entry: ${handleApiError(error)}`);
  }
};

export const deleteAlumni = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(ALUMNI_ROUTES.DELETE_ALUMNI(id));
  } catch (error) {
    throw new Error(`Failed to delete alumni entry: ${handleApiError(error)}`);
  }
};
