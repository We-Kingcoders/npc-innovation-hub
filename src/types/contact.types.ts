/**
 * Contact Message Type Definitions
 * Public "Contact Us" form submissions (npc-innovation-hub/src/pages/landing/ContactSection.tsx),
 * reviewed by an Admin from /admin/contact-messages.
 */

export type ContactMessageStatus = "Pending" | "Reviewed" | "Closed";

export const CONTACT_MESSAGE_STATUSES: ContactMessageStatus[] = [
  "Pending",
  "Reviewed",
  "Closed",
];

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitContactMessageResponse {
  status: string;
  message: string;
  data: {
    contactMessage: {
      id: string;
      email: string;
      name: string;
      createdAt: string;
    };
  };
}

export interface ContactMessagesResponse {
  status: string;
  results: number;
  data: {
    contactMessages: ContactMessage[];
    pagination?: {
      total: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    };
  };
}

export interface ContactMessageResponse {
  status: string;
  data: {
    contactMessage: ContactMessage;
  };
}

export interface ContactReplyPayload {
  subject: string;
  message: string;
}

export interface ContactReplyResponse {
  status: string;
  message: string;
  data: {
    contactMessage: ContactMessage;
  };
}
