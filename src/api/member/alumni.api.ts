// src/api/member/alumni.api.ts

import apiClient from "../client";

export interface AlumniSummary {
  name: string;
  imageUrl: string | null;
  role: string;
}

interface RawAlumniSummary {
  name?: string;
  fullName?: string;
  imageUrl: string | null;
  role: string;
}

// The backend stores and returns the name under `fullName`, not `name` —
// normalize it here so the rest of the frontend can keep using `name`.
const normalizeAlumniSummary = (raw: RawAlumniSummary): AlumniSummary => ({
  name: raw.fullName ?? raw.name ?? "",
  imageUrl: raw.imageUrl,
  role: raw.role,
});

export const getAlumni = async (): Promise<AlumniSummary[]> => {
  const response = await apiClient.get("/api/alumni");
  const body = response.data as {
    data?: { alumni?: RawAlumniSummary[] };
  };
  const alumni = body.data?.alumni;
  return Array.isArray(alumni) ? alumni.map(normalizeAlumniSummary) : [];
};
