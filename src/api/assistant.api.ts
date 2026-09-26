// src/api/assistant.api.ts
//
// The NPC AI Assistant - talks to the real backend at
// POST /api/assistant/chat via the shared apiClient (same base URL, same
// auth-token injection as every other real feature), NOT a separate
// FastAPI URL. That separate URL (CHATBOT_API_URL) never pointed at a
// real, deployed service - see Help.tsx for the feature this replaces.
//
// apiClient only attaches an Authorization header when a token exists in
// localStorage, so an anonymous visitor's request goes through with none
// - matching the backend's attachUserIfPresent middleware, which treats a
// missing header as "anonymous", not an error.
import apiClient from "./client";

export interface AssistantChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantChatRequest {
  message: string;
  conversationId?: string;
  history?: AssistantChatTurn[];
  language?: string;
}

export interface AssistantChatResponse {
  success: true;
  data: {
    message: string;
    conversationId: string;
    language: string;
  };
}

export interface AssistantChatErrorResponse {
  success: false;
  message: string;
}

export const sendAssistantMessage = async (
  payload: AssistantChatRequest,
): Promise<AssistantChatResponse> => {
  const response = await apiClient.post<AssistantChatResponse>(
    "/api/assistant/chat",
    payload,
  );
  return response.data;
};
