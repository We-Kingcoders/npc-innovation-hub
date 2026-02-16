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
 * Get all hire inquiries
 */
export const getHireInquiries = async (): Promise<HireInquiriesResponse> => {
  const response = await apiClient.get(HIRE_ROUTES.GET_ALL_INQUIRIES);
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
