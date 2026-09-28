/**
 * Contact Message Admin API Service
 */

import apiClient from "../client";
import type {
  ContactMessagesResponse,
  ContactMessageResponse,
  ContactReplyPayload,
  ContactReplyResponse,
  ContactMessageStatus,
} from "../../types/contact.types";

const CONTACT_ROUTES = {
  GET_ALL: "/api/admin/contact-messages",
  GET_BY_ID: (id: string) => `/api/admin/contact-messages/${id}`,
  UPDATE: (id: string) => `/api/admin/contact-messages/${id}`,
  DELETE: (id: string) => `/api/admin/contact-messages/${id}`,
  REPLY: (id: string) => `/api/admin/contact-messages/${id}/reply`,
};

/**
 * Get all contact messages. The backend paginates (default limit: 10) - a
 * high limit is requested here so the admin panel's own client-side
 * search/filter has the full set to work with, same reasoning as
 * `getHireInquiries`.
 */
export const getContactMessages =
  async (): Promise<ContactMessagesResponse> => {
    const response = await apiClient.get(CONTACT_ROUTES.GET_ALL, {
      params: { limit: 1000 },
    });
    return response.data as ContactMessagesResponse;
  };

/**
 * Count of contact messages still awaiting review ("Pending") - for a
 * sidebar/nav badge, mirroring getPendingHireInquiriesCount.
 */
export const getPendingContactMessagesCount = async (): Promise<number> => {
  const response = await apiClient.get(CONTACT_ROUTES.GET_ALL, {
    params: { status: "Pending", limit: 1 },
  });
  const data = response.data as ContactMessagesResponse;
  return data.data.pagination?.total ?? 0;
};

export const getContactMessage = async (
  id: string,
): Promise<ContactMessageResponse> => {
  const response = await apiClient.get(CONTACT_ROUTES.GET_BY_ID(id));
  return response.data as ContactMessageResponse;
};

export const updateContactMessageStatus = async (
  id: string,
  status: ContactMessageStatus,
): Promise<ContactMessageResponse> => {
  const response = await apiClient.patch(CONTACT_ROUTES.UPDATE(id), {
    status,
  });
  return response.data as ContactMessageResponse;
};

export const deleteContactMessage = async (
  id: string,
): Promise<{ status: string }> => {
  const response = await apiClient.delete(CONTACT_ROUTES.DELETE(id));
  return response.data as { status: string };
};

export const replyToContactMessage = async (
  id: string,
  payload: ContactReplyPayload,
): Promise<ContactReplyResponse> => {
  const response = await apiClient.post(CONTACT_ROUTES.REPLY(id), payload);
  return response.data as ContactReplyResponse;
};
