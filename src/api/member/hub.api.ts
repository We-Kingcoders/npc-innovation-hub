// src/api/member/hub.api.ts

import apiClient from "../client";
import type {
  HubMessage,
  HubMessagesListResponse,
  HubMessageResponse,
} from "../../types/chat.types";

export const hubApi = {
  /**
   * GET /api/hub/messages
   * Fetch all hub channel messages
   */
  getHubMessages: async (): Promise<HubMessage[]> => {
    const response =
      await apiClient.get<HubMessagesListResponse>("/api/hub/messages");
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data?.data?.messages) return data.data.messages;
    if ((data as unknown as { data: HubMessage[] })?.data) {
      const inner = (
        data as unknown as { data: HubMessage[] | { messages: HubMessage[] } }
      ).data;
      if (Array.isArray(inner)) return inner;
    }
    return [];
  },

  /**
   * POST /api/hub/messages
   * Send a message to the hub channel
   */
  sendHubMessage: async (content: string): Promise<HubMessage> => {
    const response = await apiClient.post<HubMessageResponse>(
      "/api/hub/messages",
      { content },
    );
    return response.data.data.message;
  },

  /**
   * PATCH /api/hub/messages/:id
   * Edit a hub message
   */
  editHubMessage: async (id: string, content: string): Promise<HubMessage> => {
    const response = await apiClient.patch<HubMessageResponse>(
      `/api/hub/messages/${id}`,
      { content },
    );
    return response.data.data.message;
  },

  /**
   * DELETE /api/hub/messages/:id
   * Delete a hub message
   */
  deleteHubMessage: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/hub/messages/${id}`);
  },
};
