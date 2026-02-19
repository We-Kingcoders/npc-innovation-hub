// src/hooks/useDirectMessages.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "../api/member/chat.api";
import { useAuth } from "./useAuth";
import type { DirectMessage, ConversationPreview } from "../types/chat.types";

const POLL_INTERVAL_CONVERSATIONS = 5000;
const POLL_INTERVAL_MESSAGES = 3000;

// ── Conversations (sidebar) ──────────────────────────────────────────────────

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await chatApi.getRecentConversations(user.id);
      setConversations(data);
      setError(null);
    } catch (err) {
      console.error("[useConversations]", err);
      setError("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchConversations();
    const id = setInterval(fetchConversations, POLL_INTERVAL_CONVERSATIONS);
    return () => clearInterval(id);
  }, [fetchConversations]);

  return { conversations, isLoading, error, refetch: fetchConversations };
};

// ── Direct messages with a specific user ─────────────────────────────────────

export const useDirectMessages = (selectedUserId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedUserId) return;
    try {
      const data = await chatApi.getMessagesWithUser(selectedUserId);
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error("[useDirectMessages]", err);
      setError("Failed to load messages");
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }
    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));

    pollRef.current = setInterval(fetchMessages, POLL_INTERVAL_MESSAGES);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selectedUserId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // ── Send ──────────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedUserId || !content.trim() || !user) return;

      const tempId = `temp-${Date.now()}`;
      const optimistic: DirectMessage = {
        id: tempId,
        senderId: user.id,
        receiverId: selectedUserId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
          role: user.role,
        },
        receiver: {
          id: selectedUserId,
          firstName: "",
          lastName: "",
          email: "",
          image: null,
          role: "Member",
        },
      };

      setMessages((prev) => [...prev, optimistic]);
      setIsSending(true);

      try {
        const real = await chatApi.sendDirectMessage(selectedUserId, content);
        setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));
      } catch (err) {
        console.error("[sendMessage]", err);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError("Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [selectedUserId, user],
  );

  // ── Edit ──────────────────────────────────────────────────────────────────

  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!selectedUserId) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content, updatedAt: new Date().toISOString() }
            : m,
        ),
      );
      setEditingMessageId(null);

      try {
        const updated = await chatApi.editDirectMessage(
          selectedUserId,
          messageId,
          content,
        );
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? updated : m)),
        );
      } catch (err) {
        console.error("[editMessage]", err);
        setError("Failed to edit message");
        fetchMessages();
      }
    },
    [selectedUserId, fetchMessages],
  );

  // ── Delete ────────────────────────────────────────────────────────────────

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!selectedUserId) return;

      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      try {
        await chatApi.deleteDirectMessage(selectedUserId, messageId);
      } catch (err) {
        console.error("[deleteMessage]", err);
        setError("Failed to delete message");
        fetchMessages();
      }
    },
    [selectedUserId, fetchMessages],
  );

  return {
    messages,
    isLoading,
    isSending,
    error,
    editingMessageId,
    messagesEndRef,
    sendMessage,
    editMessage,
    deleteMessage,
    setEditingMessageId,
    refetch: fetchMessages,
  };
};
