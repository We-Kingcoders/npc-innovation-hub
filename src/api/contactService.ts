// src/api/contactService.ts
import client from "./client";
import type {
  ContactMessagePayload,
  SubmitContactMessageResponse,
} from "../types/contact.types";

export const submitContactMessage = async (
  data: ContactMessagePayload,
): Promise<SubmitContactMessageResponse> => {
  const response = await client.post<SubmitContactMessageResponse>(
    "/api/contact",
    data,
  );
  return response.data;
};
