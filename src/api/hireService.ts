// src/api/hireService.ts
import client from "./client";
import type {
  HireInquiryPayload,
  HireInquiryResponse,
} from "../types/hire.types";

export const submitHireInquiry = async (
  data: HireInquiryPayload,
): Promise<HireInquiryResponse> => {
  const response = await client.post<HireInquiryResponse>("/api/hire-us", data);
  return response.data;
};
