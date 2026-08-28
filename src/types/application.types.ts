/**
 * Membership Application Type Definitions
 * TypeScript interfaces for the public "Join Us" application flow.
 * Matches POST /api/applications on the backend exactly.
 */

export type ApplicationGender = "Male" | "Female" | "Other";

export const APPLICATION_GENDERS: ApplicationGender[] = [
  "Male",
  "Female",
  "Other",
];

export interface MembershipApplicationFormValues {
  fullName: string;
  email: string;
  githubUrl: string;
  skills: string[];
  phoneNumber: string;
  gender: ApplicationGender | "";
  strengths: string;
  weaknesses: string;
  applicationLetter: File | null;
  image: File | null;
}

export interface MembershipApplication {
  id: string;
  imageUrl: string | null;
  fullName: string;
  email: string;
  githubUrl: string;
  skills: string[];
  phoneNumber: string;
  gender: ApplicationGender;
  strengths: string;
  weaknesses: string;
  applicationLetterUrl: string;
  status: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitApplicationResponse {
  status: "success";
  message: string;
  data: {
    application: MembershipApplication;
  };
}

export interface ApplicationApiError {
  message: string;
  statusCode: number;
}
