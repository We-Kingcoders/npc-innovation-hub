// src/api/admin/heroMembers.api.ts

import apiClient, { handleApiError } from "../client";
import { HERO_MEMBER_ROUTES } from "../routes";
import type {
  HeroMember,
  MemberPickerOption,
} from "../../types/heroMember.types";

type GetHeroMembersResponse = {
  status: string;
  data: { heroMembers: HeroMember[] };
};

type AddHeroMemberResponse = {
  status: string;
  message: string;
  data: { heroMember: HeroMember };
};

type GetMembersPickerResponse = {
  status: string;
  data: { members: MemberPickerOption[] };
};

export const getHeroMembers = async (): Promise<HeroMember[]> => {
  try {
    const response = await apiClient.get<GetHeroMembersResponse>(
      HERO_MEMBER_ROUTES.GET_HERO_MEMBERS,
    );
    return response.data.data.heroMembers;
  } catch (error) {
    throw new Error(`Failed to fetch hero members: ${handleApiError(error)}`);
  }
};

export const getMembersPicker = async (
  search?: string,
): Promise<MemberPickerOption[]> => {
  try {
    const response = await apiClient.get<GetMembersPickerResponse>(
      HERO_MEMBER_ROUTES.GET_MEMBERS_PICKER,
      { params: search ? { search } : undefined },
    );
    return response.data.data.members;
  } catch (error) {
    throw new Error(
      `Failed to fetch member picker options: ${handleApiError(error)}`,
    );
  }
};

export const addHeroMember = async (memberId: string): Promise<HeroMember> => {
  try {
    const response = await apiClient.post<AddHeroMemberResponse>(
      HERO_MEMBER_ROUTES.ADD_HERO_MEMBER,
      { memberId },
    );
    return response.data.data.heroMember;
  } catch (error) {
    throw new Error(`Failed to add hero member: ${handleApiError(error)}`);
  }
};

export const removeHeroMember = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(HERO_MEMBER_ROUTES.REMOVE_HERO_MEMBER(id));
  } catch (error) {
    throw new Error(`Failed to remove hero member: ${handleApiError(error)}`);
  }
};

export const reorderHeroMembers = async (
  orderedIds: string[],
): Promise<void> => {
  try {
    await apiClient.patch(HERO_MEMBER_ROUTES.REORDER_HERO_MEMBERS, {
      orderedIds,
    });
  } catch (error) {
    throw new Error(`Failed to reorder hero members: ${handleApiError(error)}`);
  }
};
