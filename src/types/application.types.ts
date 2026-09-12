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
  // Populated by the backend's `reviewer` include (User.id/firstName/
  // lastName) - reviewedBy alone is just the raw user id, never
  // meaningful to show directly in the admin UI.
  reviewer?: { id: string; firstName: string; lastName: string } | null;
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

/**
 * Admin review of membership applications.
 * Matches GET/PATCH /api/admin/applications/* on the backend exactly.
 */

export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Pending",
  "Accepted",
  "Rejected",
];

export interface AdminApplicationsResponse {
  status: "success";
  results: number;
  data: {
    applications: MembershipApplication[];
  };
}

export interface AdminApplicationResponse {
  status: "success";
  data: {
    application: MembershipApplication;
  };
}

export interface RejectApplicationPayload {
  reason?: string;
}

export interface RejectApplicationResponse {
  status: "success";
  message: string;
  data: {
    application: MembershipApplication;
  };
}

export interface AcceptedApplicationUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AcceptApplicationResponse {
  status: "success";
  message: string;
  data: {
    application: MembershipApplication;
    user: AcceptedApplicationUser;
    member: { id: string };
  };
}
