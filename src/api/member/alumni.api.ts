// src/api/member/alumni.api.ts

import apiClient from "../client";

export interface AlumniSummary {
  name: string;
  imageUrl: string | null;
  role: string;
}

export const getAlumni = async (): Promise<AlumniSummary[]> => {
  const response = await apiClient.get("/api/alumni");
  const body = response.data as {
    data?: { alumni?: AlumniSummary[] };
  };
  const alumni = body.data?.alumni;
  return Array.isArray(alumni) ? alumni : [];
};
