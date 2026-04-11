// src/services/member.service.ts

import client from "../api/client";
import type {
  Member,
  MemberResponse,
  CreateMemberPayload,
  UpdateMemberPayload,
  ContactsPayload,
  EducationPayload,
  SkillsPayload,
} from "../types/member.types";

const toFormData = (payload: Record<string, unknown>): FormData => {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (val === null || val === undefined) return;
    if (val instanceof File) {
      fd.append(key, val);
    } else {
      fd.append(key, String(val));
    }
  });
  return fd;
};

export const memberService = {
  /** GET /api/members/{userId} */
  getMember: async (userId: string): Promise<Member> => {
    const res = await client.get<MemberResponse>(`/api/members/${userId}`);
    return res.data.data.member;
  },

  /** POST /api/members/{userId} — multipart/form-data */
  createMember: async (
    userId: string,
    payload: CreateMemberPayload,
  ): Promise<Member> => {
    const fd = toFormData(payload as unknown as Record<string, unknown>);
    const res = await client.post<MemberResponse>(
      `/api/members/${userId}`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data.data.member;
  },

  /** PATCH /api/members/{userId} — multipart/form-data */
  updateMember: async (
    userId: string,
    payload: UpdateMemberPayload,
  ): Promise<Member> => {
    const fd = toFormData(payload as unknown as Record<string, unknown>);
    const res = await client.patch<MemberResponse>(
      `/api/members/${userId}`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data.data.member;
  },

  /** POST /api/members/{userId}/contacts — application/json */
  saveContacts: async (
    userId: string,
    payload: ContactsPayload,
  ): Promise<void> => {
    await client.post(`/api/members/${userId}/contacts`, payload);
  },

  /** PATCH /api/members/{userId}/contacts */
  updateContacts: async (
    userId: string,
    payload: ContactsPayload,
  ): Promise<void> => {
    await client.patch(`/api/members/${userId}/contacts`, payload);
  },

  /** POST /api/members/{userId}/education — multipart/form-data */
  saveEducation: async (
    userId: string,
    payload: EducationPayload,
  ): Promise<void> => {
    const fd = new FormData();
    if (payload.degree) fd.append("degree", payload.degree);
    if (payload.institution) fd.append("institution", payload.institution);
    if (payload.description) fd.append("description", payload.description);
    if (payload.educationImage)
      fd.append("educationImage", payload.educationImage);
    await client.post(`/api/members/${userId}/education`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** PATCH /api/members/{userId}/education */
  updateEducation: async (
    userId: string,
    payload: EducationPayload,
  ): Promise<void> => {
    const fd = new FormData();
    if (payload.degree) fd.append("degree", payload.degree);
    if (payload.institution) fd.append("institution", payload.institution);
    if (payload.description) fd.append("description", payload.description);
    if (payload.educationImage)
      fd.append("educationImage", payload.educationImage);
    await client.patch(`/api/members/${userId}/education`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** POST /api/members/{userId}/skills — application/json */
  saveSkills: async (userId: string, payload: SkillsPayload): Promise<void> => {
    await client.post(`/api/members/${userId}/skills`, payload);
  },

  /** PATCH /api/members/{userId}/skills */
  updateSkills: async (
    userId: string,
    payload: SkillsPayload,
  ): Promise<void> => {
    await client.patch(`/api/members/${userId}/skills`, payload);
  },
};
