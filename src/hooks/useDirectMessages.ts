// // src/hooks/useDirectMessages.ts

// import { useState, useEffect, useCallback, useRef } from "react";
// import { chatApi } from "../api/member/chat.api";
// import { useAuth } from "./useAuth";
// import type { DirectMessage, ConversationPreview } from "../types/chat.types";

// const POLL_CONVERSATIONS = 5000;
// const POLL_MESSAGES = 3000;

// // ── Sort messages oldest → newest (bottom = newest, like WhatsApp) ────────────
// const sortAsc = (msgs: DirectMessage[]): DirectMessage[] =>
//   [...msgs].sort(
//     (a, b) =>
//       new Date(a.timestamp || a.createdAt).getTime() -
//       new Date(b.timestamp || b.createdAt).getTime(),
//   );

// // ── Conversations ─────────────────────────────────────────────────────────────

// export const useConversations = () => {
//   const { user } = useAuth();
//   const [conversations, setConversations] = useState<ConversationPreview[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchConversations = useCallback(async () => {
//     if (!user?.id) return;
//     try {
//       const data = await chatApi.getRecentConversations(user.id);
//       setConversations(data);
//       setError(null);
//     } catch (err) {
//       console.error("[useConversations]", err);
//       setError("Failed to load conversations");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     fetchConversations();
//     const id = setInterval(fetchConversations, POLL_CONVERSATIONS);
//     return () => clearInterval(id);
//   }, [fetchConversations]);

//   return { conversations, isLoading, error, refetch: fetchConversations };
// };

// // ── Direct messages ───────────────────────────────────────────────────────────

// export const useDirectMessages = (selectedUserId: string | null) => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState<DirectMessage[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

//   // messagesEndRef used by parent to scroll to bottom
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const isFirstLoad = useRef(true);

//   const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
//     messagesEndRef.current?.scrollIntoView({ behavior });
//   }, []);

//   const fetchMessages = useCallback(
//     async (silent = false) => {
//       if (!selectedUserId) return;
//       try {
//         const data = await chatApi.getMessagesWithUser(selectedUserId);
//         const sorted = sortAsc(data);
//         setMessages(sorted);
//         setError(null);

//         // On first load, jump instantly to bottom; thereafter smooth scroll
//         if (isFirstLoad.current) {
//           isFirstLoad.current = false;
//           // Use rAF to wait for DOM to paint before scrolling
//           requestAnimationFrame(() =>
//             scrollToBottom("instant" as ScrollBehavior),
//           );
//         }
//       } catch (err) {
//         if (!silent) {
//           console.error("[useDirectMessages]", err);
//           setError("Failed to load messages");
//         }
//       }
//     },
//     [selectedUserId, scrollToBottom],
//   );

//   // Reset and reload when selected user changes
//   useEffect(() => {
//     if (!selectedUserId) {
//       setMessages([]);
//       setError(null);
//       return;
//     }

//     isFirstLoad.current = true;
//     setIsLoading(true);
//     setMessages([]);

//     fetchMessages().finally(() => setIsLoading(false));

//     // Poll silently (don't show loading for subsequent fetches)
//     pollRef.current = setInterval(() => fetchMessages(true), POLL_MESSAGES);

//     return () => {
//       if (pollRef.current) clearInterval(pollRef.current);
//     };
//   }, [selectedUserId, fetchMessages]);

//   // Auto-scroll to bottom whenever new messages arrive
//   useEffect(() => {
//     if (messages.length > 0) {
//       scrollToBottom("smooth");
//     }
//   }, [messages.length, scrollToBottom]);

//   // ── Send ──────────────────────────────────────────────────────────────────

//   const sendMessage = useCallback(
//     async (content: string) => {
//       if (!selectedUserId || !content.trim() || !user) return;

//       const tempId = `temp-${Date.now()}`;
//       const now = new Date().toISOString();
//       const optimistic: DirectMessage = {
//         id: tempId,
//         senderId: user.id,
//         receiverId: selectedUserId,
//         content,
//         timestamp: now,
//         isRead: false,
//         isDeleted: false,
//         createdAt: now,
//         updatedAt: now,
//         sender: {
//           id: user.id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           image: user.image,
//           role: user.role,
//         },
//         receiver: {
//           id: selectedUserId,
//           firstName: "",
//           lastName: "",
//           email: "",
//           image: null,
//           role: "Member",
//         },
//       };

//       // Append optimistic message at the end (bottom)
//       setMessages((prev) => [...prev, optimistic]);
//       setIsSending(true);

//       // Scroll to reveal the new message
//       requestAnimationFrame(() => scrollToBottom("smooth"));

//       try {
//         const real = await chatApi.sendDirectMessage(selectedUserId, content);
//         setMessages((prev) =>
//           sortAsc(prev.map((m) => (m.id === tempId ? real : m))),
//         );
//       } catch (err) {
//         console.error("[sendMessage]", err);
//         setMessages((prev) => prev.filter((m) => m.id !== tempId));
//         setError("Failed to send message");
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [selectedUserId, user, scrollToBottom],
//   );

//   // ── Edit ──────────────────────────────────────────────────────────────────

//   const editMessage = useCallback(
//     async (messageId: string, content: string) => {
//       if (!selectedUserId) return;

//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === messageId
//             ? { ...m, content, updatedAt: new Date().toISOString() }
//             : m,
//         ),
//       );
//       setEditingMessageId(null);

//       try {
//         const updated = await chatApi.editDirectMessage(
//           selectedUserId,
//           messageId,
//           content,
//         );
//         setMessages((prev) =>
//           prev.map((m) => (m.id === messageId ? updated : m)),
//         );
//       } catch (err) {
//         console.error("[editMessage]", err);
//         setError("Failed to edit message");
//         fetchMessages(true);
//       }
//     },
//     [selectedUserId, fetchMessages],
//   );

//   // ── Delete ────────────────────────────────────────────────────────────────

//   const deleteMessage = useCallback(
//     async (messageId: string) => {
//       if (!selectedUserId) return;

//       setMessages((prev) => prev.filter((m) => m.id !== messageId));

//       try {
//         await chatApi.deleteDirectMessage(selectedUserId, messageId);
//       } catch (err) {
//         console.error("[deleteMessage]", err);
//         setError("Failed to delete message");
//         fetchMessages(true);
//       }
//     },
//     [selectedUserId, fetchMessages],
//   );

//   return {
//     messages,
//     isLoading,
//     isSending,
//     error,
//     editingMessageId,
//     messagesEndRef,
//     sendMessage,
//     editMessage,
//     deleteMessage,
//     setEditingMessageId,
//     refetch: fetchMessages,
//   };
// };

// src/hooks/useDirectMessages.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "../api/member/chat.api";
import { useAuth } from "./useAuth";
import type { DirectMessage, ConversationPreview } from "../types/chat.types";
import type { ReplyRef } from "../components/chat/MessageBubble";

const POLL_CONVERSATIONS = 5000;
const POLL_MESSAGES = 3000;

// Sort oldest → newest (WhatsApp style: newest at bottom)
const sortAsc = (msgs: DirectMessage[]): DirectMessage[] =>
  [...msgs].sort(
    (a, b) =>
      new Date(a.timestamp || a.createdAt).getTime() -
      new Date(b.timestamp || b.createdAt).getTime(),
  );

// ── Conversations ─────────────────────────────────────────────────────────────

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
    const id = setInterval(fetchConversations, POLL_CONVERSATIONS);
    return () => clearInterval(id);
  }, [fetchConversations]);

  return { conversations, isLoading, error, refetch: fetchConversations };
};

// ── Direct messages ───────────────────────────────────────────────────────────

// We store replyTo locally since the backend may not support it yet.
// Key: messageId → ReplyRef
type ReplyMap = Map<string, ReplyRef>;

export const useDirectMessages = (selectedUserId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  // Local map of messageId → replyTo for messages we send in this session
  const replyMapRef = useRef<ReplyMap>(new Map());
  const [isLoading, setIsLoading] = useState(false);
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
      if (!selectedUserId) return;
      try {
        const data = await chatApi.getMessagesWithUser(selectedUserId);
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
          console.error("[useDirectMessages]", err);
          setError("Failed to load messages");
        }
      }
    },
    [selectedUserId, scrollToBottom],
  );

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      setError(null);
      replyMapRef.current.clear();
      return;
    }
    isFirstLoad.current = true;
    setIsLoading(true);
    setMessages([]);
    fetchMessages().finally(() => setIsLoading(false));
    pollRef.current = setInterval(() => fetchMessages(true), POLL_MESSAGES);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selectedUserId, fetchMessages]);

  useEffect(() => {
    if (messages.length > 0) scrollToBottom("smooth");
  }, [messages.length, scrollToBottom]);

  // Get replyTo for a message (from local map or from message itself)
  const getReplyTo = useCallback((msgId: string): ReplyRef | null => {
    return replyMapRef.current.get(msgId) ?? null;
  }, []);

  // ── Send ──────────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (content: string, replyTo: ReplyRef | null = null) => {
      if (!selectedUserId || !content.trim() || !user) return;

      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();

      // Store replyTo in local map immediately
      if (replyTo) {
        replyMapRef.current.set(tempId, replyTo);
      }

      const optimistic: DirectMessage = {
        id: tempId,
        senderId: user.id,
        receiverId: selectedUserId,
        content,
        timestamp: now,
        isRead: false,
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
      requestAnimationFrame(() => scrollToBottom("smooth"));

      try {
        const real = await chatApi.sendDirectMessage(selectedUserId, content);
        // Transfer replyTo from temp ID to real ID
        if (replyTo) {
          replyMapRef.current.delete(tempId);
          replyMapRef.current.set(real.id, replyTo);
        }
        setMessages((prev) =>
          sortAsc(prev.map((m) => (m.id === tempId ? real : m))),
        );
      } catch (err) {
        console.error("[sendMessage]", err);
        replyMapRef.current.delete(tempId);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError("Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [selectedUserId, user, scrollToBottom],
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
        fetchMessages(true);
      }
    },
    [selectedUserId, fetchMessages],
  );

  // ── Delete ────────────────────────────────────────────────────────────────

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!selectedUserId) return;
      replyMapRef.current.delete(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      try {
        await chatApi.deleteDirectMessage(selectedUserId, messageId);
      } catch (err) {
        console.error("[deleteMessage]", err);
        setError("Failed to delete message");
        fetchMessages(true);
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
    getReplyTo,
    refetch: fetchMessages,
  };
};
