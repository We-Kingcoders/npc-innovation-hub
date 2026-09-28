/**
 * Hero Media Type Definitions
 * Admin-controlled homepage hero background images/videos.
 * Matches GET /api/hero-media (public) and /api/admin/hero-media (admin CRUD).
 */

export type HeroMediaType = "IMAGE" | "VIDEO";

// Public shape - exactly what the homepage carousel renders. Never
// cloudinaryPublicId/uploadedBy/title/caption/displayOrder/isDefault -
// those are admin-only (see AdminHeroMedia below).
export interface HeroMedia {
  id: string;
  type: HeroMediaType;
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
}

export interface HeroMediaResponse {
  status: string;
  results: number;
  data: {
    media: HeroMedia[];
  };
}

// Admin shape - the full row, including internal fields the admin UI
// needs for management (Cloudinary cross-reference, ordering, state).
export interface AdminHeroMedia extends HeroMedia {
  cloudinaryPublicId: string;
  title: string | null;
  caption: string | null;
  isActive: boolean;
  isDefault: boolean;
  displayOrder: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminHeroMediaListResponse {
  status: string;
  results: number;
  data: {
    media: AdminHeroMedia[];
  };
}

export interface AdminHeroMediaItemResponse {
  status: string;
  message: string;
  data: {
    media: AdminHeroMedia;
  };
}
