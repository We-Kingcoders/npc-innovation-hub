// src/hooks/useHubMessages.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { hubApi } from "../api/member/hub.api";
import { useAuth } from "./useAuth";
import { useSocket } from "../contexts/SocketContext";
import type { HubMessage } from "../types/chat.types";
import type { ReplyRef } from "../components/chat/MessageBubble";

const POLL_INTERVAL = 3000;

const sortAsc = (msgs: HubMessage[]): HubMessage[] =>
  [...msgs].sort(
    (a, b) =>
      new Date(a.timestamp || a.createdAt).getTime() -
      new Date(b.timestamp || b.createdAt).getTime(),
  );

type ReplyMap = Map<string, ReplyRef>;

export const useHubMessages = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<HubMessage[]>([]);
  const replyMapRef = useRef<ReplyMap>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstLoad = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const fetchMessages = useCallback(
    async (silent = false) => {
      try {
        const data = await hubApi.getHubMessages();
        const sorted = sortAsc(data);
        setMessages(sorted);
        setError(null);
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
          requestAnimationFrame(() =>
            scrollToBottom("instant" as ScrollBehavior),
          );
        }
      } catch (err) {
        if (!silent) {
          console.error("[useHubMessages]", err);
          setError("Failed to load hub messages");
        }
      }
    },
    [scrollToBottom],
  );

  useEffect(() => {
    isFirstLoad.current = true;
    fetchMessages().finally(() => setIsLoading(false));
    pollRef.current = setInterval(() => fetchMessages(true), POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom("smooth");
  }, [messages.length, scrollToBottom]);

  // Live push: the hub room broadcasts to every connected member, including
  // the sender (unlike DMs), so `receive_hub_msg` is deduped by id against
  // whatever the optimistic-send-then-REST-response flow already added.
  // Polling above stays as a fallback for when the socket is briefly
  // disconnected.
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg: HubMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return sortAsc([...prev, msg]);
      });
    };

    const handleEdit = (payload: {
      messageId: string;
      content: string;
      updatedAt: string;
    }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === payload.messageId
            ? { ...m, content: payload.content, updatedAt: payload.updatedAt }
            : m,
        ),
      );
    };

    const handleDelete = (payload: { messageId: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== payload.messageId));
    };

    socket.on("receive_hub_msg", handleReceive);
    socket.on("edit_hub_msg", handleEdit);
    socket.on("delete_hub_msg", handleDelete);

    return () => {
      socket.off("receive_hub_msg", handleReceive);
      socket.off("edit_hub_msg", handleEdit);
      socket.off("delete_hub_msg", handleDelete);
    };
  }, [socket]);

  const getReplyTo = useCallback((msgId: string): ReplyRef | null => {
    return replyMapRef.current.get(msgId) ?? null;
  }, []);

  // ── Send ──────────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (content: string, replyTo: ReplyRef | null = null) => {
      if (!content.trim() || !user) return;
      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();

      if (replyTo) replyMapRef.current.set(tempId, replyTo);

      const optimistic: HubMessage = {
        id: tempId,
        senderId: user.id,
        roomId: "",
        content,
        timestamp: now,
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
          role: user.role,
        },
      };

      setMessages((prev) => [...prev, optimistic]);
      setIsSending(true);
      requestAnimationFrame(() => scrollToBottom("smooth"));

      try {
        const real = await hubApi.sendHubMessage(content);
        if (replyTo) {
          replyMapRef.current.delete(tempId);
          replyMapRef.current.set(real.id, replyTo);
        }
        setMessages((prev) =>
          sortAsc(prev.map((m) => (m.id === tempId ? real : m))),
        );
      } catch (err) {
        console.error("[sendHubMessage]", err);
        replyMapRef.current.delete(tempId);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError("Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [user, scrollToBottom],
  );

  // ── Edit ──────────────────────────────────────────────────────────────────

  const editMessage = useCallback(
    async (id: string, content: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, content, updatedAt: new Date().toISOString() }
            : m,
        ),
      );
      setEditingMessageId(null);
      try {
        const updated = await hubApi.editHubMessage(id, content);
        setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
      } catch (err) {
        console.error("[editHubMessage]", err);
        setError("Failed to edit message");
        fetchMessages(true);
      }
    },
    [fetchMessages],
  );

  // ── Delete ────────────────────────────────────────────────────────────────

  const deleteMessage = useCallback(
    async (id: string) => {
      replyMapRef.current.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      try {
        await hubApi.deleteHubMessage(id);
      } catch (err) {
        console.error("[deleteHubMessage]", err);
        setError("Failed to delete message");
        fetchMessages(true);
      }
    },
    [fetchMessages],
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
    getReplyTo,
  };
};
