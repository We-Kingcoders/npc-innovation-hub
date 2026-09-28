/**
 * Hero Media API Service
 * Public, unauthenticated: admin-curated homepage hero background media.
 */

import apiClient from "./client";
import type { HeroMedia, HeroMediaResponse } from "../types/heroMedia.types";

const HERO_MEDIA_ROUTE = "/api/hero-media";

/**
 * Get admin-curated hero media (active items only, in display order) for
 * the public homepage hero.
 */
export const getHeroMedia = async (): Promise<HeroMedia[]> => {
  const response = await apiClient.get<HeroMediaResponse>(HERO_MEDIA_ROUTE);
  return response.data?.data?.media ?? [];
};
