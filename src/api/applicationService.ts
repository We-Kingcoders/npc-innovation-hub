/**
 * Membership Application API Service
 *
 * Public, unauthenticated endpoint for the "Join Us" application flow.
 */

import apiClient from "./client";
import type { SubmitApplicationResponse } from "../types/application.types";

const APPLICATIONS_ROUTE = "/api/applications";

export const submitMembershipApplication = async (
  formData: FormData,
  onUploadProgress?: (percent: number) => void,
): Promise<SubmitApplicationResponse> => {
  // The legacy `@types/axios` devDependency declares its own, older
  // AxiosInstance overloads that merge with axios's real bundled types and
  // don't know about `onUploadProgress`. It's a genuine, supported axios
  // option at runtime — the `any` below only sidesteps that types-package
  // collision, it isn't loosening our own config's shape.
  const requestConfig: Record<string, unknown> = {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onUploadProgress
      ? (event: { loaded: number; total?: number }) => {
          if (event.total) {
            onUploadProgress(Math.round((event.loaded / event.total) * 100));
          }
        }
      : undefined,
  };

  const response = await apiClient.post<SubmitApplicationResponse>(
    APPLICATIONS_ROUTE,
    formData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestConfig as any,
  );
  return response.data;
};
