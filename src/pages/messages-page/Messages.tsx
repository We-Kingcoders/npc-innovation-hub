// import React, { useState } from "react";
// import { Smile, Reply, Paperclip, Send, MoreHorizontal } from "lucide-react";
// import LeftPanel from "../../components/member/LeftPanel"; // Make sure path is correct

// // Define proper interfaces
// interface Reaction {
//   emoji: string;
//   count: number;
// }

// interface Message {
//   id: number;
//   from: "them" | "me";
//   text: string;
//   time: string;
//   reactions: Reaction[]; // Both message types can have reactions
// }

// interface Member {
//   name: string;
//   lastMessage: string;
//   time: string;
//   unread: number;
// }

// const chatMembers: Member[] = [
//   {
//     name: "Sam Rwanda",
//     lastMessage: "Hello, are you there?",
//     time: "11:30 AM",
//     unread: 1,
//   },
//   {
//     name: "ALAN",
//     lastMessage: "Hello, are you there?",
//     time: "11:30 AM",
//     unread: 1,
//   },
//   {
//     name: "Peace",
//     lastMessage: "Hello, are you there?",
//     time: "11:30 AM",
//     unread: 0,
//   },
// ];

// const defaultMessages: Message[] = [
//   {
//     id: 1,
//     from: "them",
//     text: "Hi there! How are you doing today?",
//     time: "11:30 AM",
//     reactions: [{ emoji: "👍", count: 2 }],
//   },
//   {
//     id: 2,
//     from: "me",
//     text: "Hey! I'm doing great, thanks for asking. How about you?",
//     time: "11:31 AM",
//     reactions: [],
//   },
//   {
//     id: 3,
//     from: "them",
//     text: "I'm doing well too! Just working on some projects. What have you been up to?",
//     time: "11:33 AM",
//     reactions: [{ emoji: "😊", count: 1 }],
//   },
// ];

// const reactionEmojis = ["👍", "❤️", "😊", "😂", "👏", "🔥"];

// export const Messages: React.FC = () => {
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
//   const [msg, setMsg] = useState("");
//   const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
//   const [showReactions, setShowReactions] = useState<number | null>(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   const [messagesByMember, setMessagesByMember] = useState<
//     Record<number, Message[]>
//   >({
//     0: defaultMessages,
//     1: [],
//     2: [],
//   });

//   const selectedName =
//     selectedIndex !== null ? chatMembers[selectedIndex]?.name : "";
//   const messages =
//     selectedIndex !== null ? messagesByMember[selectedIndex] || [] : [];

//   const handleReaction = (messageId: number, emoji: string) => {
//     if (selectedIndex === null) return;

//     setMessagesByMember((prev) => {
//       const updatedMessages = (prev[selectedIndex] || []).map((msg) => {
//         if (msg.id === messageId) {
//           const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
//           if (existingReaction) {
//             return {
//               ...msg,
//               reactions: msg.reactions.map((r) =>
//                 r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
//               ),
//             };
//           } else {
//             return {
//               ...msg,
//               reactions: [...msg.reactions, { emoji, count: 1 }],
//             };
//           }
//         }
//         return msg;
//       });

//       return {
//         ...prev,
//         [selectedIndex]: updatedMessages,
//       };
//     });

//     setShowReactions(null);
//   };

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (msg.trim() && selectedIndex !== null) {
//       const newMessage: Message = {
//         id: messages.length + 1,
//         from: "me",
//         text: msg,
//         time: new Date().toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//         reactions: [],
//       };
//       setMessagesByMember((prev) => ({
//         ...prev,
//         [selectedIndex]: [...(prev[selectedIndex] || []), newMessage],
//       }));
//       setMsg("");
//     }
//   };

//   return (
//     <div className="flex gap-6">
//       <LeftPanel
//         members={chatMembers}
//         selected={selectedIndex}
//         onSelect={setSelectedIndex}
//       />

//       <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col p-8 relative">
//         <div className="mb-6 pb-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-gray-800">
//               {selectedName}
//             </h2>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//               <span className="text-sm text-gray-500">Online</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto space-y-4">
//           {messages.map((msgObj) => (
//             <div
//               key={msgObj.id}
//               className={`flex items-start group relative ${
//                 msgObj.from === "me" ? "flex-row-reverse" : ""
//               }`}
//               onMouseEnter={() => setHoveredMessage(msgObj.id)}
//               onMouseLeave={() => setHoveredMessage(null)}
//             >
//               <div className="w-10 h-10 bg-gradient-to-r from-[#0C2340] to-[#1a3a5c] rounded-full flex items-center justify-center text-white font-medium">
//                 {msgObj.from === "me" ? "Me" : selectedName?.charAt(0)}
//               </div>

//               <div
//                 className={`max-w-md px-4 py-3 rounded-2xl mx-3 relative ${
//                   msgObj.from === "me"
//                     ? "bg-[#0C2340] text-white"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 <div className="text-sm leading-relaxed">{msgObj.text}</div>
//                 <div
//                   className={`text-xs mt-2 ${
//                     msgObj.from === "me" ? "text-gray-300" : "text-gray-500"
//                   }`}
//                 >
//                   {msgObj.time}
//                 </div>

//                 {msgObj.reactions.length > 0 && (
//                   <div className="flex gap-1 mt-2">
//                     {msgObj.reactions.map((reaction, idx) => (
//                       <div
//                         key={idx}
//                         className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs flex items-center gap-1"
//                       >
//                         <span>{reaction.emoji}</span>
//                         <span>{reaction.count}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {hoveredMessage === msgObj.id && (
//                 <div
//                   className={`absolute top-0 flex items-center gap-2 ${
//                     msgObj.from === "me" ? "left-0" : "right-0"
//                   }`}
//                 >
//                   <button
//                     onClick={() => setShowReactions(msgObj.id)}
//                     className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
//                     title="Add reaction"
//                   >
//                     <Smile className="w-4 h-4 text-gray-600" />
//                   </button>
//                   <button
//                     className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
//                     title="Reply"
//                   >
//                     <Reply className="w-4 h-4 text-gray-600" />
//                   </button>
//                   <button
//                     className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
//                     title="More"
//                   >
//                     <MoreHorizontal className="w-4 h-4 text-gray-600" />
//                   </button>
//                 </div>
//               )}

//               {showReactions === msgObj.id && (
//                 <div className="absolute top-12 z-10 bg-white rounded-lg shadow-lg p-2 flex gap-1">
//                   {reactionEmojis.map((emoji) => (
//                     <button
//                       key={emoji}
//                       onClick={() => handleReaction(msgObj.id, emoji)}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg"
//                     >
//                       {emoji}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <form
//           onSubmit={handleSendMessage}
//           className="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-xl"
//         >
//           <div className="w-10 h-10 bg-gradient-to-r from-[#0C2340] to-[#1a3a5c] rounded-full flex items-center justify-center text-white font-medium">
//             Me
//           </div>

//           <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-200">
//             <input
//               className="flex-1 outline-none text-sm"
//               placeholder="Type a message..."
//               value={msg}
//               onChange={(e) => setMsg(e.target.value)}
//             />
//             <button
//               type="button"
//               className="text-gray-400 hover:text-[#0C2340]"
//             >
//               <Paperclip className="w-4 h-4" />
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowEmojiPicker((prev) => !prev)}
//               className="text-gray-400 hover:text-[#0C2340]"
//             >
//               <Smile className="w-4 h-4" />
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={!msg.trim()}
//             className="p-3 bg-[#0C2340] text-white rounded-lg hover:bg-[#1a3a5c] disabled:opacity-50"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </form>

//         {showEmojiPicker && (
//           <div className="absolute bottom-24 right-8 bg-white rounded-lg shadow-lg p-4 grid grid-cols-8 gap-2 z-10">
//             {[
//               "😀",
//               "😊",
//               "😂",
//               "🥰",
//               "😍",
//               "🤔",
//               "😢",
//               "😡",
//               "👍",
//               "👎",
//               "❤️",
//               "🔥",
//               "👏",
//               "🎉",
//               "💯",
//               "🚀",
//             ].map((emoji) => (
//               <button
//                 key={emoji}
//                 onClick={() => {
//                   setMsg((prev) => prev + emoji);
//                   setShowEmojiPicker(false);
//                 }}
//                 className="p-2 hover:bg-gray-100 rounded-lg text-lg"
//               >
//                 {emoji}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// src/pages/messages-page/Messages.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Reply,
  Pencil,
  Trash2,
  Check,
  X,
  MessageSquare,
} from "lucide-react";
import LeftPanel from "../../components/member/LeftPanel";
import { useDirectMessages } from "../../hooks/useDirectMessages";
import { useAuth } from "../../hooks/useAuth";
import type { DirectMessage } from "../../types/chat.types";
import { useParams, useNavigate } from "react-router-dom";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatTime = (iso: string): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const formatRelative = (iso: string): string => {
  if (!iso) return "";
  try {
    const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
    return new Date(iso).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

// ── Avatar ────────────────────────────────────────────────────────────────────

const Avatar: React.FC<{
  image: string | null;
  name: string;
  size?: string;
}> = ({ image, name, size = "w-10 h-10" }) => {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${size} rounded-full object-cover flex-shrink-0`}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-white font-semibold text-xs bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

// ── Loading skeleton ──────────────────────────────────────────────────────────

const MessageSkeleton: React.FC<{ reverse?: boolean }> = ({ reverse }) => (
  <div
    className={`flex items-end gap-3 animate-pulse ${
      reverse ? "flex-row-reverse" : ""
    }`}
  >
    <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
    <div
      className={`space-y-1 max-w-sm flex flex-col ${
        reverse ? "items-end" : ""
      }`}
    >
      <div className="h-3 bg-gray-200 rounded w-24" />
      <div className="h-10 bg-gray-200 rounded-2xl w-48" />
    </div>
  </div>
);

// ── Delete confirm ────────────────────────────────────────────────────────────

const DeleteConfirm: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Message</h3>
      <p className="text-sm text-gray-500 mb-5">
        This action cannot be undone. Are you sure?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-4 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Emoji list ────────────────────────────────────────────────────────────────

const EMOJIS = [
  "😀",
  "😊",
  "😂",
  "🥰",
  "😍",
  "🤔",
  "😢",
  "😡",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "👏",
  "🎉",
  "💯",
  "🚀",
];

// ── Message bubble ────────────────────────────────────────────────────────────

interface BubbleProps {
  msg: DirectMessage;
  isMe: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const MessageBubble: React.FC<BubbleProps> = ({
  msg,
  isMe,
  editingId,
  setEditingId,
  onEdit,
  onDelete,
}) => {
  const [hovered, setHovered] = useState(false);
  const [editText, setEditText] = useState(msg.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isEditing = editingId === msg.id;
  const isTemp = msg.id.startsWith("temp-");

  const senderName = isMe
    ? "You"
    : `${msg.sender.firstName} ${msg.sender.lastName}`.trim() || "Unknown";

  const isEdited =
    msg.updatedAt && msg.createdAt && msg.updatedAt !== msg.createdAt;

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== msg.content) {
      onEdit(msg.id, trimmed);
    } else {
      setEditingId(null);
    }
  };

  return (
    <>
      {showDeleteConfirm && (
        <DeleteConfirm
          onConfirm={() => {
            onDelete(msg.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <div
        className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : ""} ${
          isTemp ? "opacity-60" : "opacity-100"
        } transition-opacity`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Avatar
          image={isMe ? null : msg.sender.image}
          name={senderName}
          size="w-9 h-9"
        />

        <div
          className={`flex flex-col max-w-sm ${
            isMe ? "items-end" : "items-start"
          }`}
        >
          {/* Name + time row */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-600">
              {senderName}
            </span>
            <span className="text-xs text-gray-400">
              {formatTime(msg.timestamp)}
            </span>
            {isMe && !isTemp && msg.isRead && (
              <Check size={11} className="text-blue-400" />
            )}
          </div>

          {/* Edit mode */}
          {isEditing ? (
            <div className="flex flex-col gap-2 w-full min-w-[200px]">
              <textarea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="w-full text-sm border border-blue-400 rounded-xl px-3 py-2 outline-none resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Check size={11} /> Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={11} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Message bubble */
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                isMe
                  ? "bg-[#0C2340] text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
              {isEdited && (
                <span
                  className={`text-xs ml-2 ${
                    isMe ? "text-gray-300" : "text-gray-400"
                  }`}
                ></span>
              )}
            </div>
          )}

          {/* Relative timestamp */}
          <span className="text-xs text-gray-400 mt-1">
            {formatRelative(msg.timestamp)}
          </span>
        </div>

        {/* Hover actions */}
        {hovered && !isTemp && !isEditing && (
          <div
            className={`flex items-center gap-1 self-center ${
              isMe ? "order-first mr-1" : "ml-1"
            }`}
          >
            {isMe && (
              <button
                onClick={() => {
                  setEditText(msg.content);
                  setEditingId(msg.id);
                }}
                className="p-1.5 bg-white rounded-lg shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"
                title="Edit"
              >
                <Pencil size={12} className="text-gray-500" />
              </button>
            )}
            <button
              className="p-1.5 bg-white rounded-lg shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"
              title="Reply"
            >
              <Reply size={12} className="text-gray-500" />
            </button>
            {isMe && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 bg-white rounded-lg shadow-md border border-gray-100 hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 size={12} className="text-red-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export const Messages: React.FC = () => {
  const { id: paramUserId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    paramUserId ?? null,
  );
  const [inputMsg, setInputMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

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
  } = useDirectMessages(selectedUserId);

  // Sync URL param → state
  useEffect(() => {
    if (paramUserId) setSelectedUserId(paramUserId);
  }, [paramUserId]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    navigate(`/messages/${userId}`, { replace: true });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    await sendMessage(inputMsg.trim());
    setInputMsg("");
  };

  // Derive the other user's info from message history
  const otherUser = (() => {
    for (const m of messages) {
      if (m.senderId !== user?.id) return m.sender;
      if (m.receiverId !== user?.id) return m.receiver;
    }
    return null;
  })();

  const headerName = otherUser
    ? `${otherUser.firstName} ${otherUser.lastName}`.trim()
    : selectedUserId
      ? "Conversation"
      : "Select a conversation";

  return (
    <div className="flex gap-6 h-full">
      <LeftPanel selectedUserId={selectedUserId} onSelect={handleSelectUser} />

      <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {otherUser && (
              <Avatar
                image={otherUser.image}
                name={`${otherUser.firstName} ${otherUser.lastName}`.trim()}
                size="w-9 h-9"
              />
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-800">{headerName}</h2>
              {selectedUserId && (
                <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Online
                </span>
              )}
            </div>
          </div>
          {selectedUserId && (
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={18} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-100 px-6 py-2 text-sm text-red-600 flex-shrink-0">
            {error}
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {!selectedUserId ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <MessageSquare size={48} className="text-gray-200" />
              <p className="font-medium text-sm">
                Select a conversation to start messaging
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-5">
              <MessageSkeleton />
              <MessageSkeleton reverse />
              <MessageSkeleton />
              <MessageSkeleton reverse />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
              <MessageSquare size={36} className="text-gray-200" />
              <p>No messages yet — say hello! 👋</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isMe={msg.senderId === user?.id}
                editingId={editingMessageId}
                setEditingId={setEditingMessageId}
                onEdit={editMessage}
                onDelete={deleteMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedUserId && (
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 relative">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              {user && (
                <Avatar
                  image={user.image}
                  name={`${user.firstName} ${user.lastName}`.trim()}
                  size="w-9 h-9"
                />
              )}

              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-blue-400 focus-within:bg-white transition-colors">
                <input
                  type="text"
                  placeholder={`Message ${headerName}...`}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-sm"
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title="Attach file"
                >
                  <Paperclip size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((p) => !p)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title="Emoji"
                >
                  <Smile size={15} />
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputMsg.trim() || isSending}
                className="p-3 bg-[#0C2340] text-white rounded-xl hover:bg-[#1a3a5c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Send"
              >
                <Send size={16} />
              </button>
            </form>

            {/* Emoji picker */}
            {showEmojiPicker && (
              <div
                ref={emojiRef}
                className="absolute bottom-20 right-6 bg-white rounded-xl shadow-xl border border-gray-200 p-3 grid grid-cols-8 gap-1 z-20"
              >
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputMsg((p) => p + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-base transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
