/**
 * Hero Member Type Definitions
 * Admin-curated members featured on the public landing page.
 * Matches GET /admin/hero-members (admin) and GET /api/hero-members (public).
 */

export interface HeroMember {
  id: string;
  memberId: string;
  name: string;
  role: string;
  imageUrl: string | null;
  order: number;
}

export interface HeroMembersResponse {
  status: string;
  data: {
    heroMembers: HeroMember[];
  };
}

export interface MemberPickerOption {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
}
