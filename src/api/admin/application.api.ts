/**
 * Membership Application Admin API Service
 * Handles admin review of applications submitted via the public "Join Us" flow.
 */

import apiClient from "../client";
import type {
  AdminApplicationsResponse,
  AdminApplicationResponse,
  AcceptApplicationResponse,
  RejectApplicationResponse,
  RejectApplicationPayload,
  ApplicationStatus,
} from "../../types/application.types";

const APPLICATION_ROUTES = {
  GET_ALL_APPLICATIONS: "/api/admin/applications",
  GET_APPLICATION_BY_ID: (id: string) => `/api/admin/applications/${id}`,
  ACCEPT_APPLICATION: (id: string) => `/api/admin/applications/${id}/accept`,
  REJECT_APPLICATION: (id: string) => `/api/admin/applications/${id}/reject`,
};

/**
 * Get applications, optionally filtered by status
 */
export const getApplications = async (
  status?: ApplicationStatus,
): Promise<AdminApplicationsResponse> => {
  const response = await apiClient.get(
    APPLICATION_ROUTES.GET_ALL_APPLICATIONS,
    { params: status ? { status } : undefined },
  );
  return response.data as AdminApplicationsResponse;
};

/**
 * Get a single application by id
 */
export const getApplication = async (
  id: string,
): Promise<AdminApplicationResponse> => {
  const response = await apiClient.get(
    APPLICATION_ROUTES.GET_APPLICATION_BY_ID(id),
  );
  return response.data as AdminApplicationResponse;
};

/**
 * Accept an application: creates the member account and emails credentials
 */
export const acceptApplication = async (
  id: string,
): Promise<AcceptApplicationResponse> => {
  const response = await apiClient.patch(
    APPLICATION_ROUTES.ACCEPT_APPLICATION(id),
  );
  return response.data as AcceptApplicationResponse;
};

/**
 * Reject an application, optionally with a reason emailed to the applicant
 */
export const rejectApplication = async (
  id: string,
  payload?: RejectApplicationPayload,
): Promise<RejectApplicationResponse> => {
  const response = await apiClient.patch(
    APPLICATION_ROUTES.REJECT_APPLICATION(id),
    payload ?? {},
  );
  return response.data as RejectApplicationResponse;
};
