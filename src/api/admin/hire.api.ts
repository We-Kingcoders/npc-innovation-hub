/**
 * Hire Inquiry API Service
 * Handles all hire inquiry-related API calls
 */

import apiClient from "../client";
import type {
  HireInquiriesResponse,
  HireInquiryResponse,
  ReplyPayload,
  ReplyResponse,
  UpdateStatusPayload,
} from "../../types/hire.types";

const HIRE_ROUTES = {
  GET_ALL_INQUIRIES: "/api/admin/hire-inquiries",
  GET_INQUIRY_BY_ID: (id: string) => `/api/admin/hire-inquiries/${id}`,
  UPDATE_INQUIRY: (id: string) => `/api/admin/hire-inquiries/${id}`,
  DELETE_INQUIRY: (id: string) => `/api/admin/hire-inquiries/${id}`,
  REPLY_TO_INQUIRY: (id: string) => `/api/admin/hire-inquiries/${id}/reply`,
};

/**
 * Get all hire inquiries.
 *
 * The backend paginates (default limit: 10). The admin list view does its
 * own client-side search/filter/pagination over whatever this returns, so
 * we ask for a high limit here to make sure "all inquiries" actually means
 * all of them rather than silently just the most recent 10.
 */
export const getHireInquiries = async (): Promise<HireInquiriesResponse> => {
  const response = await apiClient.get(HIRE_ROUTES.GET_ALL_INQUIRIES, {
    params: { limit: 1000 },
  });
  return response.data as HireInquiriesResponse;
};

/**
 * Get hire inquiry by ID
 */
export const getHireInquiry = async (
  id: string,
): Promise<HireInquiryResponse> => {
  const response = await apiClient.get(HIRE_ROUTES.GET_INQUIRY_BY_ID(id));
  return response.data as HireInquiryResponse;
};

/**
 * Get the count of hire inquiries still awaiting a response (status "Pending").
 * Used for the admin sidebar's notification badge - asks the backend to filter
 * and paginate down to nothing so this stays a cheap call.
 */
export const getPendingHireInquiriesCount = async (): Promise<number> => {
  const response = await apiClient.get(HIRE_ROUTES.GET_ALL_INQUIRIES, {
    params: { status: "Pending", limit: 1 },
  });
  const data = response.data as HireInquiriesResponse;
  return data.data.pagination?.total ?? 0;
};

/**
 * Update hire inquiry status
 */
export const updateHireInquiryStatus = async (
  id: string,
  payload: UpdateStatusPayload,
): Promise<HireInquiryResponse> => {
  const response = await apiClient.put(HIRE_ROUTES.UPDATE_INQUIRY(id), payload);
  return response.data as HireInquiryResponse;
};

/**
 * Delete hire inquiry
 */
export const deleteHireInquiry = async (
  id: string,
): Promise<{ status: string; message: string }> => {
  const response = await apiClient.delete(HIRE_ROUTES.DELETE_INQUIRY(id));
  return response.data as { status: string; message: string };
};

/**
 * Reply to hire inquiry
 */
export const replyToInquiry = async (
  id: string,
  payload: ReplyPayload,
): Promise<ReplyResponse> => {
  const response = await apiClient.post(
    HIRE_ROUTES.REPLY_TO_INQUIRY(id),
    payload,
  );
  return response.data as ReplyResponse;
};
