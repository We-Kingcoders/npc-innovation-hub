// src/api/member/chat.api.ts

import apiClient from "../client";
import type {
  DirectMessage,
  ConversationPreview,
} from "../../types/chat.types";

// ── Utility: always return a plain string, never an object ────────────────────
const str = (val: unknown): string => {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  return String(val);
};

// ── Build a typed ChatUser from a raw object ──────────────────────────────────
const toUser = (raw: unknown) => {
  const u = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(u.id),
    firstName: str(u.firstName),
    lastName: str(u.lastName),
    email: str(u.email),
    image: typeof u.image === "string" ? u.image : null,
    role: str(u.role || "Member"),
  };
};

// ── Convert a raw object into a typed DirectMessage ───────────────────────────
const toDirectMessage = (raw: unknown): DirectMessage => {
  const m = (raw ?? {}) as Record<string, unknown>;
  return {
    id: str(m.id),
    senderId: str(m.senderId),
    receiverId: str(m.receiverId),
    content: str(m.content),
    timestamp: str(m.timestamp ?? m.createdAt),
    isRead: Boolean(m.isRead),
    isDeleted: Boolean(m.isDeleted),
    createdAt: str(m.createdAt),
    updatedAt: str(m.updatedAt ?? m.createdAt),
    sender: toUser(m.sender),
    receiver: toUser(m.receiver),
  };
};

// ── Unwrap any API envelope into a raw array ──────────────────────────────────
const unwrapArray = (response: unknown): unknown[] => {
  if (Array.isArray(response)) return response;
  const r = (response ?? {}) as Record<string, unknown>;

  if (r.data && typeof r.data === "object" && !Array.isArray(r.data)) {
    const d = r.data as Record<string, unknown>;
    if (Array.isArray(d.messages)) return d.messages;
    if (Array.isArray(d.conversations)) return d.conversations;
    if (Array.isArray(d.data)) return d.data;
  }
  if (Array.isArray(r.data)) return r.data;
  if (Array.isArray(r.messages)) return r.messages;
  if (Array.isArray(r.conversations)) return r.conversations;
  return [];
};

// ── Convert raw items into ConversationPreview[] ──────────────────────────────
//
// Your API returns items shaped like:
//   { user: { id, firstName, lastName, email, image }, lastMessage: { id, content, senderId, ... }, unreadCount: 0 }
//
// We also handle the fallback cases just in case the shape ever changes.
//
const toConversations = (
  items: unknown[],
  currentUserId: string,
): ConversationPreview[] => {
  if (items.length === 0) return [];

  return items.flatMap((item): ConversationPreview[] => {
    const c = (item ?? {}) as Record<string, unknown>;

    // ── Case A: { user: {}, lastMessage: {}, unreadCount } ──────────────────
    // This is the shape your backend actually returns.
    if (c.user && typeof c.user === "object" && "lastMessage" in c) {
      const u = c.user as Record<string, unknown>;
      const lm = (c.lastMessage ?? {}) as Record<string, unknown>;
      const lastMsgContent =
        typeof lm.content === "string" ? lm.content : str(lm.content);
      const lastMsgTime = str(lm.timestamp ?? lm.updatedAt ?? lm.createdAt);

      return [
        {
          userId: str(u.id),
          firstName: str(u.firstName),
          lastName: str(u.lastName),
          image: typeof u.image === "string" ? u.image : null,
          lastMessage: lastMsgContent,
          lastMessageTime: lastMsgTime,
          unreadCount: typeof c.unreadCount === "number" ? c.unreadCount : 0,
          isOnline: Boolean(c.isOnline),
        },
      ];
    }

    // ── Case B: already ConversationPreview-shaped ──────────────────────────
    // { userId, firstName, lastName, lastMessage (string), ... }
    if (
      "userId" in c ||
      ("firstName" in c && !("senderId" in c) && !("user" in c))
    ) {
      const rawLast = c.lastMessage;
      const lastMsg =
        typeof rawLast === "string"
          ? rawLast
          : rawLast && typeof rawLast === "object"
            ? str((rawLast as Record<string, unknown>).content)
            : "";

      return [
        {
          userId: str(c.userId ?? c.id),
          firstName: str(c.firstName),
          lastName: str(c.lastName),
          image: typeof c.image === "string" ? c.image : null,
          lastMessage: lastMsg,
          lastMessageTime: str(c.lastMessageTime ?? c.timestamp ?? c.updatedAt),
          unreadCount: typeof c.unreadCount === "number" ? c.unreadCount : 0,
          isOnline: Boolean(c.isOnline),
        },
      ];
    }

    // ── Case C: raw DirectMessage — group by "other" user ───────────────────
    if ("senderId" in c || "receiverId" in c) {
      const senderId = str(c.senderId);
      const receiverId = str(c.receiverId);
      const isFromMe = senderId === currentUserId;
      const otherId = isFromMe ? receiverId : senderId;
      if (!otherId) return [];

      const otherUser = toUser(isFromMe ? c.receiver : c.sender);
      const msgTime = str(c.timestamp ?? c.updatedAt ?? c.createdAt);

      return [
        {
          userId: otherId,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          image: otherUser.image,
          lastMessage: str(c.content),
          lastMessageTime: msgTime,
          unreadCount: !isFromMe && !c.isRead ? 1 : 0,
          isOnline: false,
        },
      ];
    }

    console.warn("[chatApi] Unrecognized /api/chat item shape:", c);
    return [];
  });
};

// ── Unwrap a single-message envelope (POST / PATCH responses) ─────────────────
const unwrapSingleMessage = (raw: unknown): DirectMessage => {
  const r = (raw ?? {}) as Record<string, unknown>;
  if (r.data && typeof r.data === "object") {
    const d = r.data as Record<string, unknown>;
    if (d.message) return toDirectMessage(d.message);
    return toDirectMessage(d);
  }
  if (r.message) return toDirectMessage(r.message);
  return toDirectMessage(r);
};

// ── Public API ────────────────────────────────────────────────────────────────

export const chatApi = {
  /**
   * GET /api/chat
   * Returns items shaped as: { user, lastMessage, unreadCount }
   */
  getRecentConversations: async (
    currentUserId: string,
  ): Promise<ConversationPreview[]> => {
    const res = await apiClient.get("/api/chat");
    const items = unwrapArray(res.data);
    return toConversations(items, currentUserId);
  },

  /**
   * GET /api/chat/:userId
   * Fetch all messages in a conversation with a specific user.
   */
  getMessagesWithUser: async (userId: string): Promise<DirectMessage[]> => {
    const res = await apiClient.get(`/api/chat/${userId}`);
    const items = unwrapArray(res.data);
    return items.map(toDirectMessage);
  },

  /**
   * POST /api/chat/:userId
   * Send a direct message.
   */
  sendDirectMessage: async (
    userId: string,
    content: string,
  ): Promise<DirectMessage> => {
    const res = await apiClient.post(`/api/chat/${userId}`, { content });
    return unwrapSingleMessage(res.data);
  },

  /**
   * PATCH /api/chat/:userId/:messageId
   * Edit a direct message.
   */
  editDirectMessage: async (
    userId: string,
    messageId: string,
    content: string,
  ): Promise<DirectMessage> => {
    const res = await apiClient.patch(`/api/chat/${userId}/${messageId}`, {
      content,
    });
    return unwrapSingleMessage(res.data);
  },

  /**
   * DELETE /api/chat/:userId/:messageId
   * Delete a direct message.
   */
  deleteDirectMessage: async (
    userId: string,
    messageId: string,
  ): Promise<void> => {
    await apiClient.delete(`/api/chat/${userId}/${messageId}`);
  },
};
