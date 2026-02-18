// /**
//  * Hire Inquiry Type Definitions
//  * TypeScript interfaces for hire inquiry data structures
//  */

// export interface HireInquiry {
//   id: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   company_name: string;
//   job_title: string;
//   country: string;
//   message: string;
//   consent: boolean;
//   status: "Pending" | "Reviewed" | "Contacted" | "Rejected";
//   created_at: string;
//   updated_at: string;
// }

// export interface HireInquiriesResponse {
//   status: string;
//   results: number;
//   data: {
//     inquiries: HireInquiry[];
//     pagination?: {
//       total: number;
//       currentPage: number;
//       totalPages: number;
//       limit: number;
//     };
//   };
// }

// export interface HireInquiryResponse {
//   status: string;
//   data: {
//     inquiry: HireInquiry;
//   };
// }

// export interface ReplyPayload {
//   subject: string;
//   message: string;
// }

// export interface UpdateStatusPayload {
//   status: "Pending" | "Reviewed" | "Contacted" | "Rejected";
//   notes?: string;
// }

// export interface ReplyResponse {
//   status: string;
//   message: string;
//   data: {
//     inquiry: string;
//   };
// }

// export type InquiryStatus = "Pending" | "Reviewed" | "Contacted" | "Rejected";

// export const INQUIRY_STATUSES: InquiryStatus[] = [
//   "Pending",
//   "Reviewed",
//   "Contacted",
//   "Rejected",
// ];

/**
 * Hire Inquiry Type Definitions
 * TypeScript interfaces for hire inquiry data structures
 */

export interface HireInquiryPayload {
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  job_title: string;
  country: string;
  message: string;
  consent: boolean;
}

export interface HireInquiry {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  job_title: string;
  country: string;
  message: string;
  consent: boolean;
  status: "Pending" | "Reviewed" | "Contacted" | "Rejected";
  created_at: string;
  updated_at: string;
}

export interface HireInquiriesResponse {
  status: string;
  results: number;
  data: {
    inquiries: HireInquiry[];
    pagination?: {
      total: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    };
  };
}

export interface HireInquiryResponse {
  status: string;
  data: {
    inquiry: HireInquiry;
  };
}

export interface ReplyPayload {
  subject: string;
  message: string;
}

export interface UpdateStatusPayload {
  status: "Pending" | "Reviewed" | "Contacted" | "Rejected";
  notes?: string;
}

export interface ReplyResponse {
  status: string;
  message: string;
  data: {
    inquiry: string;
  };
}

export type InquiryStatus = "Pending" | "Reviewed" | "Contacted" | "Rejected";

export const INQUIRY_STATUSES: InquiryStatus[] = [
  "Pending",
  "Reviewed",
  "Contacted",
  "Rejected",
];
