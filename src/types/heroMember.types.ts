/**
 * Hero Member Type Definitions
 * Admin-curated members featured on the public landing page.
 * Matches GET /admin/hero-members (admin) and GET /api/hero-members (public).
 */

export interface HeroMember {
  id: string;
  memberId: string;
  // The User id behind this Member profile - used to cross-reference
  // against MemberPickerOption.id below, which is keyed by User id too
  // (the picker offers every user in the system, not just those who
  // already have a Member profile), so already-featured candidates can
  // be excluded from the search results correctly.
  userId: string;
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

// id here is a User id, not a Member id - the picker offers every active
// user in the system (Members and Admins alike), most of whom don't have
// a Member profile yet. Adding one to the hero section is what creates
// their Member row, if they don't already have one.
export interface MemberPickerOption {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
}
