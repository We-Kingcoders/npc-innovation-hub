// src/api/member/member.api.ts

import apiClient from "../client";

export interface PublicMemberSummary {
  id: string;
  userId: string;
  name: string;
  role: string;
  imageUrl?: string;
  techStack?: string[];
  tagline?: string;
  available?: boolean;
}

export interface PublicMembersPage {
  members: PublicMemberSummary[];
  totalPages: number;
  currentPage: number;
  totalMembers: number;
}

export const getPublicMembers = async (
  page: number,
  limit: number,
): Promise<PublicMembersPage> => {
  const response = await apiClient.get("/api/members/public", {
    params: { page, limit },
  });
  const body = response.data as {
    data?: {
      members?: PublicMemberSummary[];
      totalPages?: number;
      currentPage?: number;
      totalMembers?: number;
      pagination?: {
        totalPages?: number;
        currentPage?: number;
        total?: number;
      };
    };
    totalPages?: number;
  };
  const payload = body.data ?? {};
  const members = Array.isArray(payload.members) ? payload.members : [];

  return {
    members,
    totalPages:
      payload.totalPages ??
      payload.pagination?.totalPages ??
      body.totalPages ??
      1,
    currentPage: payload.currentPage ?? payload.pagination?.currentPage ?? page,
    totalMembers:
      payload.totalMembers ?? payload.pagination?.total ?? members.length,
  };
};
