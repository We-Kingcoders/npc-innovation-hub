/**
 * Hero Members API Service
 * Public, unauthenticated: admin-curated members featured on the landing page.
 */

import apiClient from "../client";
import type {
  HeroMember,
  HeroMembersResponse,
} from "../../types/heroMember.types";

const HERO_MEMBERS_ROUTE = "/api/hero-members";

/**
 * Get admin-curated hero members for the public landing page.
 *
 * Unwraps defensively: the exact response envelope wasn't confirmed against
 * the live backend when this was written, so this accepts the standard
 * `{ data: { heroMembers } }` shape this codebase otherwise uses, plus a
 * few reasonable fallbacks, mirroring the same defensive pattern already
 * used in `hub.api.ts`'s `getHubMessages`.
 */
export const getHeroMembers = async (): Promise<HeroMember[]> => {
  const response = await apiClient.get<HeroMembersResponse>(HERO_MEMBERS_ROUTE);
  const data = response.data;

  if (Array.isArray(data)) return data as unknown as HeroMember[];
  if (Array.isArray(data?.data?.heroMembers)) return data.data.heroMembers;

  const loose = data as unknown as {
    heroMembers?: HeroMember[];
    data?: HeroMember[];
  };
  if (Array.isArray(loose?.heroMembers)) return loose.heroMembers;
  if (Array.isArray(loose?.data)) return loose.data;

  return [];
};
