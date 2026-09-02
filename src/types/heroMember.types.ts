/**
 * Hero Member Type Definitions
 * Admin-curated members featured on the public landing page.
 * Matches GET /api/hero-members.
 */

export interface HeroMember {
  id: string;
  name: string;
  imageUrl: string;
  role: string;
}

export interface HeroMembersResponse {
  status: string;
  data: {
    heroMembers: HeroMember[];
  };
}
