// // src/hooks/useHubMessages.ts

// import { useState, useEffect, useCallback, useRef } from "react";
// import { hubApi } from "../api/member/hub.api";
// import { useAuth } from "./useAuth";
// import type { HubMessage } from "../types/chat.types";

// const POLL_INTERVAL = 3000;

// export const useHubMessages = () => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState<HubMessage[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSending, setIsSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);
//   const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   const fetchMessages = useCallback(async () => {
//     try {
//       const data = await hubApi.getHubMessages();
//       setMessages(data);
//       setError(null);
//     } catch (err) {
//       console.error("[useHubMessages]", err);
//       setError("Failed to load hub messages");
//     }
//   }, []);

//   useEffect(() => {
//     fetchMessages().finally(() => setIsLoading(false));
//     pollRef.current = setInterval(fetchMessages, POLL_INTERVAL);
//     return () => {
//       if (pollRef.current) clearInterval(pollRef.current);
//     };
//   }, [fetchMessages]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages.length, scrollToBottom]);

//   // ── Send ──────────────────────────────────────────────────────────────────

//   const sendMessage = useCallback(
//     async (content: string) => {
//       if (!content.trim() || !user) return;

//       const tempId = `temp-${Date.now()}`;
//       const optimistic: HubMessage = {
//         id: tempId,
//         senderId: user.id,
//         roomId: "",
//         content,
//         timestamp: new Date().toISOString(),
//         isDeleted: false,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         sender: {
//           id: user.id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           image: user.image,
//           role: user.role,
//         },
//       };

//       setMessages((prev) => [...prev, optimistic]);
//       setIsSending(true);

//       try {
//         const real = await hubApi.sendHubMessage(content);
//         setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));
//       } catch (err) {
//         console.error("[sendHubMessage]", err);
//         setMessages((prev) => prev.filter((m) => m.id !== tempId));
//         setError("Failed to send message");
//       } finally {
//         setIsSending(false);
//       }
//     },
//     [user],
//   );

//   // ── Edit ──────────────────────────────────────────────────────────────────

//   const editMessage = useCallback(
//     async (id: string, content: string) => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === id
//             ? { ...m, content, updatedAt: new Date().toISOString() }
//             : m,
//         ),
//       );
//       setEditingMessageId(null);

//       try {
//         const updated = await hubApi.editHubMessage(id, content);
//         setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
//       } catch (err) {
//         console.error("[editHubMessage]", err);
//         setError("Failed to edit message");
//         fetchMessages();
//       }
//     },
//     [fetchMessages],
//   );

//   // ── Delete ────────────────────────────────────────────────────────────────

//   const deleteMessage = useCallback(
//     async (id: string) => {
//       setMessages((prev) => prev.filter((m) => m.id !== id));

//       try {
//         await hubApi.deleteHubMessage(id);
//       } catch (err) {
//         console.error("[deleteHubMessage]", err);
//         setError("Failed to delete message");
//         fetchMessages();
//       }
//     },
//     [fetchMessages],
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
//   };
// };

// src/hooks/useHubMessages.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { hubApi } from "../api/member/hub.api";
import { useAuth } from "./useAuth";
import type { HubMessage } from "../types/chat.types";

const POLL_INTERVAL = 3000;

const sortAsc = (msgs: HubMessage[]): HubMessage[] =>
  [...msgs].sort(
    (a, b) =>
      new Date(a.timestamp || a.createdAt).getTime() -
      new Date(b.timestamp || b.createdAt).getTime(),
  );

export const useHubMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<HubMessage[]>([]);
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

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !user) return;
      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();
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
        setMessages((prev) =>
          sortAsc(prev.map((m) => (m.id === tempId ? real : m))),
        );
      } catch (err) {
        console.error("[sendHubMessage]", err);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError("Failed to send message");
      } finally {
        setIsSending(false);
      }
    },
    [user, scrollToBottom],
  );

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

  const deleteMessage = useCallback(
    async (id: string) => {
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
  };
};
