// src/api/member/member.api.ts

import apiClient from "../client";
import type { Member, MemberResponse } from "../../types/member.types";

export const getMemberById = async (userId: string): Promise<Member> => {
  const response = await apiClient.get<MemberResponse>(
    `/api/members/${userId}`,
  );
  return response.data.data.member;
};
