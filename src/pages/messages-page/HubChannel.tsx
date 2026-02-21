// // src/pages/messages-page/HubChannel.tsx

// import React, { useState, useRef, useCallback } from "react";
// import { Hash, Users, MoreHorizontal, Search, X } from "lucide-react";
// import LeftPanel from "../../components/member/LeftPanel";
// import { useHubMessages } from "../../hooks/useHubMessages";
// import { useAuth } from "../../hooks/useAuth";
// import type { HubMessage } from "../../types/chat.types";

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
// import {
//   getDateSeparatorLabel,
//   isSameDay,
//   shouldShowAvatar,
//   isGroupStart as calcGroupStart,
// } from "../../utils/chatUtils";

// // ── Skeleton ──────────────────────────────────────────────────────────────────

// const MessageSkeleton: React.FC = () => (
//   <div className="flex items-start gap-3 px-4 animate-pulse">
//     <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
//     <div className="flex-1 space-y-2">
//       <div className="flex gap-2">
//         <div className="h-3 bg-gray-200 rounded w-20" />
//         <div className="h-3 bg-gray-200 rounded w-12" />
//       </div>
//       <div className="h-10 bg-gray-200 rounded-2xl w-2/3" />
//     </div>
//   </div>
// );

// // ── Adapter ───────────────────────────────────────────────────────────────────

// const toBubble = (
//   msg: HubMessage,
//   getReplyTo: (
//     id: string,
//   ) => import("../../components/chat/MessageBubble").ReplyRef | null,
// ): BubbleMessage => ({
//   id: msg.id,
//   senderId: msg.senderId,
//   content: msg.content,
//   timestamp: msg.timestamp,
//   isRead: true,
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

// export const HubChannel: React.FC = () => {
//   const { user } = useAuth();
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
//   } = useHubMessages();

//   const handleScroll = useCallback(() => {
//     const el = scrollContainerRef.current;
//     if (!el) return;
//     setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
//   }, []);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messagesEndRef]);

//   const scrollToMessage = useCallback((msgId: string) => {
//     const el = document.getElementById(`msg-${msgId}`);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "center" });
//       el.classList.add("bg-yellow-50");
//       setTimeout(() => el.classList.remove("bg-yellow-50"), 1500);
//     }
//   }, []);

//   const handleSend = async (
//     content: string,
//     _attachments: AttachmentFile[],
//     _replyToId: string | null,
//   ) => {
//     if (!content.trim()) return;
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

//   const participantCount = new Set(messages.map((m) => m.senderId)).size;

//   const displayedMessages = searchQuery
//     ? messages.filter((m) =>
//         m.content.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     : messages;

//   const bubbles = displayedMessages.map((m) => toBubble(m, getReplyTo));

//   return (
//     <div className="flex gap-4 h-full min-h-0">
//       <LeftPanel />

//       <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden min-h-0">
//         {/* Header */}
//         <div className="px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
//                 <Hash size={20} className="text-white" />
//               </div>
//               <div>
//                 <h2 className="text-base font-bold text-gray-800 leading-tight">
//                   Hub Channel
//                 </h2>
//                 <p className="text-xs text-gray-400">
//                   General discussions and collaboration
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
//                 <Users size={13} />
//                 <span>{participantCount} active</span>
//               </div>
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
//                 <Search size={15} />
//               </button>
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                 <MoreHorizontal size={16} className="text-gray-500" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Search bar */}
//         {isSearchOpen && (
//           <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-2 flex-shrink-0 bg-gray-50">
//             <Search size={14} className="text-gray-400 flex-shrink-0" />
//             <input
//               autoFocus
//               type="text"
//               placeholder="Search hub messages..."
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
//           {isLoading ? (
//             <div className="space-y-4 py-4">
//               <MessageSkeleton />
//               <MessageSkeleton />
//               <MessageSkeleton />
//             </div>
//           ) : bubbles.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-3">
//               <Hash size={40} className="text-gray-200" />
//               <p className="font-medium">No messages yet in #hub-channel</p>
//               <p className="text-xs">Be the first to say something!</p>
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
//               {ENABLE_TYPING_INDICATOR && <TypingIndicator name="Someone" />}
//             </>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Scroll to bottom */}
//         {showScrollBtn && (
//           <div className="relative">
//             <ScrollToBottomButton onClick={scrollToBottom} />
//           </div>
//         )}

//         {/* Input */}
//         <div className="flex-shrink-0 relative">
//           <MessageInput
//             placeholder="Type a message in #hub-channel..."
//             isSending={isSending}
//             replyTarget={replyTarget}
//             onCancelReply={() => setReplyTarget(null)}
//             onSend={handleSend}
//             currentUserImage={user?.image ?? null}
//             currentUserName={
//               user ? `${user.firstName} ${user.lastName}`.trim() : "Me"
//             }
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// src/pages/messages-page/HubChannel.tsx

import React, { useState, useCallback } from "react";
import { Hash, Users } from "lucide-react";
import LeftPanel from "../../components/member/LeftPanel";
import { useHubMessages } from "../../hooks/useHubMessages";
import { useAuth } from "../../hooks/useAuth";
import type { HubMessage } from "../../types/chat.types";
import ChatShell from "../../components/chat/ChatShell";
import type {
  BubbleMessage,
  ReplyRef,
} from "../../components/chat/MessageBubble";
import type {
  ReplyTarget,
  AttachmentFile,
} from "../../components/chat/MessageInput";

// ── Adapter ───────────────────────────────────────────────────────────────────

const toBubble = (
  msg: HubMessage,
  getReplyTo: (id: string) => ReplyRef | null,
): BubbleMessage => ({
  id: msg.id,
  senderId: msg.senderId,
  content: msg.content,
  timestamp: msg.timestamp,
  isRead: true,
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

// ── Component ─────────────────────────────────────────────────────────────────

export const HubChannel: React.FC = () => {
  const { user } = useAuth();
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

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
  } = useHubMessages();

  const handleSend = useCallback(
    async (content: string, _: AttachmentFile[], __: string | null) => {
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
    },
    [sendMessage, replyTarget],
  );

  const participantCount = new Set(messages.map((m) => m.senderId)).size;
  const bubbles: BubbleMessage[] = messages.map((m) => toBubble(m, getReplyTo));

  const hubIcon = (
    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
      <Hash size={20} className="text-white" />
    </div>
  );

  const headerRight = (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
        <Users size={12} />
        <span>{participantCount} active</span>
      </div>
    </div>
  );

  return (
    <div className="flex gap-4 h-full min-h-0">
      <LeftPanel />

      <div className="flex-1 min-w-0 min-h-0">
        <ChatShell
          headerTitle="Hub Channel"
          headerSubtitle="General discussions and collaboration"
          headerIcon={hubIcon}
          headerRight={headerRight}
          messages={bubbles}
          currentUserId={user?.id ?? ""}
          isLoading={isLoading}
          error={error}
          isSending={isSending}
          currentUserImage={user?.image ?? null}
          currentUserName={
            user ? `${user.firstName} ${user.lastName}`.trim() : "Me"
          }
          inputPlaceholder="Type a message in #hub-channel..."
          replyTarget={replyTarget}
          onReply={(msg) => {
            setReplyTarget({
              id: msg.id,
              senderName:
                msg.senderId === user?.id
                  ? "You"
                  : `${msg.sender.firstName} ${msg.sender.lastName}`.trim(),
              content: msg.content,
            });
          }}
          onCancelReply={() => setReplyTarget(null)}
          onSend={handleSend}
          onEdit={editMessage}
          onDelete={deleteMessage}
          editingId={editingMessageId}
          setEditingId={setEditingMessageId}
          getReplyTo={getReplyTo}
          messagesEndRef={messagesEndRef}
          emptyTitle="No messages yet in #hub-channel"
          emptySubtitle="Be the first to say something!"
          emptyIcon={<Hash size={40} className="text-gray-200" />}
        />
      </div>
    </div>
  );
};
