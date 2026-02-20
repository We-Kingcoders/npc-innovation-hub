// // src/pages/messages-page/Messages.tsx

// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { MoreHorizontal, MessageSquare, Search, X } from "lucide-react";
// import LeftPanel from "../../components/member/LeftPanel";
// import { useDirectMessages } from "../../hooks/useDirectMessages";
// import { useAuth } from "../../hooks/useAuth";
// import { useParams, useNavigate } from "react-router-dom";
// import type { DirectMessage } from "../../types/chat.types";

// import MessageBubble from "../../components/chat/MessageBubble";
// import type { BubbleMessage } from "../../components/chat/MessageBubble";
// import MessageInput from "../../components/chat/MessageInput";
// import type {
//   ReplyTarget,
//   AttachmentFile,
// } from "../../components/chat/MessageInput";
// import DateSeparator from "../../components/chat/DateSeparator";
// import TypingIndicator from "../../components/chat/TypingIndicator";
// import ScrollToBottomButton from "../../components/chat/ScrollToBottomButton";
// import ChatAvatar from "../../components/chat/ChatAvatar";
// import {
//   getDateSeparatorLabel,
//   isSameDay,
//   shouldShowAvatar,
//   isGroupStart as calcGroupStart,
// } from "../../utils/chatUtils";

// // ── Skeleton ──────────────────────────────────────────────────────────────────

// const MessageSkeleton: React.FC<{ reverse?: boolean }> = ({ reverse }) => (
//   <div
//     className={`flex items-end gap-3 px-4 animate-pulse ${reverse ? "flex-row-reverse" : ""}`}
//   >
//     <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
//     <div
//       className={`space-y-1 max-w-sm flex flex-col ${reverse ? "items-end" : ""}`}
//     >
//       <div className="h-3 bg-gray-200 rounded w-20" />
//       <div className="h-10 bg-gray-200 rounded-2xl w-48" />
//     </div>
//   </div>
// );

// // ── Adapter ───────────────────────────────────────────────────────────────────

// const toBubble = (
//   msg: DirectMessage,
//   getReplyTo: (
//     id: string,
//   ) => import("../../components/chat/MessageBubble").ReplyRef | null,
// ): BubbleMessage => ({
//   id: msg.id,
//   senderId: msg.senderId,
//   content: msg.content,
//   timestamp: msg.timestamp,
//   isRead: msg.isRead,
//   isDeleted: msg.isDeleted,
//   updatedAt: msg.updatedAt,
//   createdAt: msg.createdAt,
//   replyTo: getReplyTo(msg.id),
//   sender: {
//     id: msg.sender.id,
//     firstName: msg.sender.firstName,
//     lastName: msg.sender.lastName,
//     image: msg.sender.image,
//   },
// });

// // ── Main ──────────────────────────────────────────────────────────────────────

// export const Messages: React.FC = () => {
//   const { id: paramUserId } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [selectedUserId, setSelectedUserId] = useState<string | null>(
//     paramUserId ?? null,
//   );
//   const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
//   const [use24h] = useState(false);
//   const [showScrollBtn, setShowScrollBtn] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const ENABLE_TYPING_INDICATOR = false;

//   const {
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
//     getReplyTo,
//   } = useDirectMessages(selectedUserId);

//   useEffect(() => {
//     if (paramUserId) setSelectedUserId(paramUserId);
//   }, [paramUserId]);

//   const handleScroll = useCallback(() => {
//     const el = scrollContainerRef.current;
//     if (!el) return;
//     setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
//   }, []);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesEndRef]);

//   // Scroll to a specific message by ID (for reply jump)
//   const scrollToMessage = useCallback((msgId: string) => {
//     const el = document.getElementById(`msg-${msgId}`);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "center" });
//       // Briefly highlight the target message
//       el.classList.add("bg-yellow-50");
//       setTimeout(() => el.classList.remove("bg-yellow-50"), 1500);
//     }
//   }, []);

//   const handleSelectUser = (userId: string) => {
//     setSelectedUserId(userId);
//     setReplyTarget(null);
//     navigate(`/messages/${userId}`, { replace: true });
//   };

//   const handleSend = async (
//     content: string,
//     _attachments: AttachmentFile[],
//     _replyToId: string | null,
//   ) => {
//     if (!content.trim()) return;
//     // Pass full replyTarget (with senderName + content) so bubble can show quote
//     await sendMessage(
//       content,
//       replyTarget
//         ? {
//             id: replyTarget.id,
//             senderName: replyTarget.senderName,
//             content: replyTarget.content,
//           }
//         : null,
//     );
//     setReplyTarget(null);
//     scrollToBottom();
//   };

//   const handleReply = (msg: BubbleMessage) => {
//     setReplyTarget({
//       id: msg.id,
//       senderName:
//         msg.senderId === user?.id
//           ? "You"
//           : `${msg.sender.firstName} ${msg.sender.lastName}`.trim(),
//       content: msg.content,
//     });
//   };

//   const otherUser = (() => {
//     for (const m of messages) {
//       if (m.senderId !== user?.id) return m.sender;
//       if (m.receiverId !== user?.id) return m.receiver;
//     }
//     return null;
//   })();

//   const headerName = otherUser
//     ? `${otherUser.firstName} ${otherUser.lastName}`.trim()
//     : selectedUserId
//       ? "Conversation"
//       : "Select a conversation";

//   const displayedMessages = searchQuery
//     ? messages.filter((m) =>
//         m.content.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     : messages;

//   const bubbles = displayedMessages.map((m) => toBubble(m, getReplyTo));

//   return (
//     <div className="flex gap-4 h-full min-h-0">
//       <LeftPanel selectedUserId={selectedUserId} onSelect={handleSelectUser} />

//       <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden min-h-0">
//         {/* Header */}
//         <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
//           <div className="flex items-center gap-3">
//             {otherUser != null && (
//               <ChatAvatar
//                 image={otherUser.image}
//                 name={`${otherUser.firstName} ${otherUser.lastName}`.trim()}
//                 size="md"
//                 isOnline
//               />
//             )}
//             {otherUser == null && !selectedUserId && (
//               <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
//                 <MessageSquare size={16} className="text-gray-400" />
//               </div>
//             )}
//             <div>
//               <h2 className="text-base font-bold text-gray-800 leading-tight">
//                 {headerName}
//               </h2>
//               {selectedUserId && otherUser != null && (
//                 <span className="text-xs text-green-500 font-medium flex items-center gap-1">
//                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
//                   Online
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-1">
//             {selectedUserId && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsSearchOpen((p) => !p);
//                   setSearchQuery("");
//                 }}
//                 className={`p-2 rounded-lg transition-colors ${
//                   isSearchOpen
//                     ? "bg-blue-50 text-blue-500"
//                     : "hover:bg-gray-100 text-gray-500"
//                 }`}
//                 title="Search messages"
//               >
//                 <Search size={16} />
//               </button>
//             )}
//             {selectedUserId && (
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                 <MoreHorizontal size={16} className="text-gray-500" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Search bar */}
//         {isSearchOpen && (
//           <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-2 flex-shrink-0 bg-gray-50">
//             <Search size={14} className="text-gray-400 flex-shrink-0" />
//             <input
//               autoFocus
//               type="text"
//               placeholder="Search messages..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
//             />
//             {searchQuery && (
//               <button
//                 type="button"
//                 onClick={() => setSearchQuery("")}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//         )}

//         {/* Error */}
//         {error && (
//           <div className="bg-red-50 border-b border-red-100 px-5 py-2 text-sm text-red-600 flex-shrink-0">
//             {error}
//           </div>
//         )}

//         {/* Messages */}
//         <div
//           ref={scrollContainerRef}
//           onScroll={handleScroll}
//           className="flex-1 overflow-y-auto py-2 min-h-0"
//         >
//           {!selectedUserId ? (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 px-8 text-center">
//               <MessageSquare size={48} className="text-gray-200" />
//               <p className="font-medium text-sm">
//                 Select a conversation or start a new one with the + button
//               </p>
//             </div>
//           ) : isLoading ? (
//             <div className="space-y-4 py-4">
//               <MessageSkeleton />
//               <MessageSkeleton reverse />
//               <MessageSkeleton />
//               <MessageSkeleton reverse />
//             </div>
//           ) : bubbles.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
//               <MessageSquare size={36} className="text-gray-200" />
//               <p>No messages yet — say hello! 👋</p>
//             </div>
//           ) : (
//             <>
//               {bubbles.map((msg, index) => {
//                 const showDateSep =
//                   index === 0 ||
//                   !isSameDay(bubbles[index - 1].timestamp, msg.timestamp);
//                 const showAv = shouldShowAvatar(bubbles, index);
//                 const groupStart = calcGroupStart(bubbles, index);

//                 return (
//                   <React.Fragment key={msg.id}>
//                     {showDateSep && (
//                       <DateSeparator
//                         label={getDateSeparatorLabel(msg.timestamp)}
//                       />
//                     )}
//                     <MessageBubble
//                       msg={msg}
//                       isMe={msg.senderId === user?.id}
//                       showAvatar={showAv}
//                       isGroupStart={groupStart}
//                       editingId={editingMessageId}
//                       setEditingId={setEditingMessageId}
//                       onEdit={editMessage}
//                       onDelete={deleteMessage}
//                       onReply={handleReply}
//                       onScrollToMessage={scrollToMessage}
//                       use24h={use24h}
//                     />
//                   </React.Fragment>
//                 );
//               })}
//               {ENABLE_TYPING_INDICATOR && otherUser != null && (
//                 <TypingIndicator
//                   name={`${otherUser?.firstName ?? ""} ${otherUser?.lastName ?? ""}`.trim()}
//                 />
//               )}
//             </>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Scroll to bottom */}
//         {showScrollBtn && selectedUserId && (
//           <div className="relative">
//             <ScrollToBottomButton onClick={scrollToBottom} />
//           </div>
//         )}

//         {/* Input */}
//         {selectedUserId && (
//           <div className="flex-shrink-0 relative">
//             <MessageInput
//               placeholder={`Message ${headerName}...`}
//               isSending={isSending}
//               replyTarget={replyTarget}
//               onCancelReply={() => setReplyTarget(null)}
//               onSend={handleSend}
//               currentUserImage={user?.image ?? null}
//               currentUserName={
//                 user ? `${user.firstName} ${user.lastName}`.trim() : "Me"
//               }
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// src/pages/messages-page/Messages.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MoreHorizontal, MessageSquare, Search, X } from "lucide-react";
import LeftPanel from "../../components/member/LeftPanel";
import { useDirectMessages } from "../../hooks/useDirectMessages";
import { useAuth } from "../../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import type { DirectMessage } from "../../types/chat.types";

import MessageBubble from "../../components/chat/MessageBubble";
import type { BubbleMessage } from "../../components/chat/MessageBubble";
import MessageInput from "../../components/chat/MessageInput";
import type {
  ReplyTarget,
  AttachmentFile,
} from "../../components/chat/MessageInput";
import DateSeparator from "../../components/chat/DateSeparator";
import TypingIndicator from "../../components/chat/TypingIndicator";
import ScrollToBottomButton from "../../components/chat/ScrollToBottomButton";
import {
  getDateSeparatorLabel,
  isSameDay,
  shouldShowAvatar,
  isGroupStart as calcGroupStart,
} from "../../utils/chatUtils";

// ── Skeleton ──────────────────────────────────────────────────────────────────

const MessageSkeleton: React.FC<{ reverse?: boolean }> = ({ reverse }) => (
  <div
    className={`flex items-end gap-3 px-4 animate-pulse ${reverse ? "flex-row-reverse" : ""}`}
  >
    <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
    <div
      className={`space-y-1 max-w-sm flex flex-col ${reverse ? "items-end" : ""}`}
    >
      <div className="h-3 bg-gray-200 rounded w-20" />
      <div className="h-10 bg-gray-200 rounded-2xl w-48" />
    </div>
  </div>
);

// ── Adapter ───────────────────────────────────────────────────────────────────

const toBubble = (
  msg: DirectMessage,
  getReplyTo: (
    id: string,
  ) => import("../../components/chat/MessageBubble").ReplyRef | null,
): BubbleMessage => ({
  id: msg.id,
  senderId: msg.senderId,
  content: msg.content,
  timestamp: msg.timestamp,
  isRead: msg.isRead,
  isDeleted: msg.isDeleted,
  updatedAt: msg.updatedAt,
  createdAt: msg.createdAt,
  replyTo: getReplyTo(msg.id),
  sender: {
    id: msg.sender.id,
    firstName: msg.sender.firstName,
    lastName: msg.sender.lastName,
    image: msg.sender.image,
  },
});

// ── Header Avatar (initials-based, consistent color) ─────────────────────────

const PALETTE = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-orange-500",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-pink-600",
];
const colorFor = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
};
const makeInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");

const HeaderAvatar: React.FC<{ name: string }> = ({ name }) => (
  <div
    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${colorFor(name)} select-none`}
  >
    {makeInitials(name) || "?"}
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

export const Messages: React.FC = () => {
  const { id: paramUserId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    paramUserId ?? null,
  );
  // Stores the name passed from LeftPanel/modal so the header shows immediately
  const [selectedMemberName, setSelectedMemberName] = useState<string>("");

  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [use24h] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ENABLE_TYPING_INDICATOR = false;

  const {
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
  } = useDirectMessages(selectedUserId);

  useEffect(() => {
    if (paramUserId) setSelectedUserId(paramUserId);
  }, [paramUserId]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesEndRef]);

  const scrollToMessage = useCallback((msgId: string) => {
    const el = document.getElementById(`msg-${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-yellow-50");
      setTimeout(() => el.classList.remove("bg-yellow-50"), 1500);
    }
  }, []);

  // LeftPanel now calls onSelect(userId, memberName) — both args always present
  const handleSelectUser = useCallback(
    (userId: string, memberName: string) => {
      setSelectedUserId(userId);
      setSelectedMemberName(memberName); // ← set immediately so header updates at once
      setReplyTarget(null);
      navigate(`/messages/${userId}`, { replace: true });
    },
    [navigate],
  );

  const handleSend = async (
    content: string,
    _attachments: AttachmentFile[],
    _replyToId: string | null,
  ) => {
    if (!content.trim()) return;
    await sendMessage(
      content,
      replyTarget
        ? {
            id: replyTarget.id,
            senderName: replyTarget.senderName,
            content: replyTarget.content,
          }
        : null,
    );
    setReplyTarget(null);
    scrollToBottom();
  };

  const handleReply = (msg: BubbleMessage) => {
    setReplyTarget({
      id: msg.id,
      senderName:
        msg.senderId === user?.id
          ? "You"
          : `${msg.sender.firstName} ${msg.sender.lastName}`.trim(),
      content: msg.content,
    });
  };

  // Derive other user from loaded messages (most accurate when messages exist)
  const otherUser = (() => {
    for (const m of messages) {
      if (m.senderId !== user?.id) return m.sender;
      if (m.receiverId !== user?.id) return m.receiver;
    }
    return null;
  })();

  // Header name: prefer name from messages, fall back to what LeftPanel passed
  const headerName =
    (otherUser
      ? `${otherUser.firstName} ${otherUser.lastName}`.trim()
      : null) ||
    selectedMemberName ||
    "";

  const displayedMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messages;

  const bubbles = displayedMessages.map((m) => toBubble(m, getReplyTo));

  return (
    <div className="flex gap-4 h-full min-h-0">
      {/* LeftPanel onSelect now receives (userId, memberName) */}
      <LeftPanel selectedUserId={selectedUserId} onSelect={handleSelectUser} />

      <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {selectedUserId && headerName ? (
              <HeaderAvatar name={headerName} />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquare size={16} className="text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight">
                {headerName || "Select a conversation"}
              </h2>
              {selectedUserId && headerName && (
                <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Online
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {selectedUserId && (
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen((p) => !p);
                  setSearchQuery("");
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isSearchOpen
                    ? "bg-blue-50 text-blue-500"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
                title="Search messages"
              >
                <Search size={16} />
              </button>
            )}
            {selectedUserId && (
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={16} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-2 flex-shrink-0 bg-gray-50">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-b border-red-100 px-5 py-2 text-sm text-red-600 flex-shrink-0">
            {error}
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto py-2 min-h-0"
        >
          {!selectedUserId ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 px-8 text-center">
              <MessageSquare size={48} className="text-gray-200" />
              <p className="font-medium text-sm">
                Select a conversation or start a new one with the + button
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4 py-4">
              <MessageSkeleton />
              <MessageSkeleton reverse />
              <MessageSkeleton />
              <MessageSkeleton reverse />
            </div>
          ) : bubbles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-3">
              <MessageSquare size={36} className="text-gray-200" />
              <p className="font-medium">No messages yet</p>
              <p className="text-xs">
                Say hello to {headerName || "your contact"} 👋
              </p>
            </div>
          ) : (
            <>
              {bubbles.map((msg, index) => {
                const showDateSep =
                  index === 0 ||
                  !isSameDay(bubbles[index - 1].timestamp, msg.timestamp);
                const showAv = shouldShowAvatar(bubbles, index);
                const groupStart = calcGroupStart(bubbles, index);
                return (
                  <React.Fragment key={msg.id}>
                    {showDateSep && (
                      <DateSeparator
                        label={getDateSeparatorLabel(msg.timestamp)}
                      />
                    )}
                    <MessageBubble
                      msg={msg}
                      isMe={msg.senderId === user?.id}
                      showAvatar={showAv}
                      isGroupStart={groupStart}
                      editingId={editingMessageId}
                      setEditingId={setEditingMessageId}
                      onEdit={editMessage}
                      onDelete={deleteMessage}
                      onReply={handleReply}
                      onScrollToMessage={scrollToMessage}
                      use24h={use24h}
                    />
                  </React.Fragment>
                );
              })}
              {ENABLE_TYPING_INDICATOR && otherUser != null && (
                <TypingIndicator
                  name={`${otherUser?.firstName ?? ""} ${otherUser?.lastName ?? ""}`.trim()}
                />
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll-to-bottom */}
        {showScrollBtn && selectedUserId && (
          <div className="relative">
            <ScrollToBottomButton onClick={scrollToBottom} />
          </div>
        )}

        {/* Input */}
        {selectedUserId && (
          <div className="flex-shrink-0 relative">
            <MessageInput
              placeholder={`Message ${headerName || "..."}...`}
              isSending={isSending}
              replyTarget={replyTarget}
              onCancelReply={() => setReplyTarget(null)}
              onSend={handleSend}
              currentUserImage={user?.image ?? null}
              currentUserName={
                user ? `${user.firstName} ${user.lastName}`.trim() : "Me"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
