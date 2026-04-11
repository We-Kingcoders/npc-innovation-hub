// src/types/member.types.ts

export interface SkillDetail {
  name: string;
  percent: number;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  description: string;
  imageUrl: string;
}

export interface Contacts {
  linkedin?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  instagram?: string;
}

export interface Member {
  id: string;
  userId: string;
  name: string;
  role: string;
  imageUrl: string | null;
  bio: string;
  education: Education | null;
  contacts: Contacts | null;
  skillDetails: SkillDetail[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MemberResponse {
  status: string;
  data: {
    member: Member;
  };
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateMemberPayload {
  name: string;
  role: string;
  bio?: string;
  image?: File | null;
}

export interface UpdateMemberPayload {
  name?: string;
  role?: string;
  bio?: string;
  image?: File | null;
}

export interface ContactsPayload {
  linkedin?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  instagram?: string;
}

export interface EducationPayload {
  degree?: string;
  institution?: string;
  description?: string;
  educationImage?: File | null;
}

export interface SkillsPayload {
  skillDetails: SkillDetail[];
}
