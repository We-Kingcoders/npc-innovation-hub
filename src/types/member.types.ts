// src/types/member.types.ts

export interface SkillDetail {
  name: string;
  percent: number;
  technologies: string[];
}

export interface SkillCategory {
  category: string;
  overall: number;
  skills: SkillDetail[];
}

export interface Education {
  degree: string;
  institution: string;
  description: string;
  imageUrl: string;
  department?: string;
  startYear?: number;
  endYear?: number | null;
  status?: string;
}

export interface Contacts {
  linkedin?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  instagram?: string;
  portfolio?: string;
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
  skillCategories?: SkillCategory[];
  skills: string[];
  hashtags?: string[];
  resumeUrl?: string | null;
  cvUrl?: string | null;
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
