// src/types/heroMember.types.ts

export interface HeroMember {
  id: string;
  memberId: string;
  name: string;
  role: string;
  imageUrl: string | null;
  order: number;
}

export interface MemberPickerOption {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
}
