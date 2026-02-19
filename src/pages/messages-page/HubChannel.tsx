// import React, { useState } from "react";
// import {
//   Hash,
//   Users,
//   Send,
//   Paperclip,
//   Smile,
//   MoreHorizontal,
//   Reply,
// } from "lucide-react";
// import LeftPanel from "../../components/member/LeftPanel";

// const members = [
//   {
//     name: "Sam Rwanda",
//     color: "#0C2340",
//     lastMessage: "Hello, are you there?",
//     time: "11:30 AM",
//     unread: 1,
//   },
//   {
//     name: "ALAN",
//     color: "#0C2340",
//     lastMessage: "Hello, are you there?",
//     time: "11:30 AM",
//     unread: 1,
//   },
//   {
//     name: "Peace",
//     color: "#A4E451",
//     lastMessage: "Hello, are you there?",
//     time: "11:30 AM",
//     unread: 0,
//   },
// ];

// const hubChannelMessages = [
//   {
//     id: 1,
//     name: "Sam Rwanda",
//     color: "#0C2340",
//     text: "Welcome everyone to the Hub Channel! Let's collaborate and share ideas effectively. Looking forward to productive discussions.",
//     time: "11:30 AM",
//     reactions: [
//       { emoji: "👍", count: 3 },
//       { emoji: "❤️", count: 1 },
//     ],
//   },
//   {
//     id: 2,
//     name: "Peace",
//     color: "#A4E451",
//     text: "Great to be here! I'm excited to work with this amazing team. Does anyone have updates on the current project status?",
//     time: "11:32 AM",
//     reactions: [{ emoji: "😊", count: 2 }],
//   },
//   {
//     id: 3,
//     name: "Sam Rwanda",
//     color: "#0C2340",
//     text: "The project is moving along well. We've completed the initial phase and are now focusing on the implementation details. I'll share a detailed update in our next meeting.",
//     time: "11:35 AM",
//     reactions: [],
//   },
//   {
//     id: 4,
//     name: "ALAN",
//     color: "#1a3a5c",
//     text: "Perfect! I've been working on the documentation. Will have it ready for review by tomorrow. Any specific areas you'd like me to focus on?",
//     time: "11:40 AM",
//     reactions: [{ emoji: "🔥", count: 1 }],
//   },
// ];

// export const HubChannel: React.FC = () => {
//   const [message, setMessage] = useState("");
//   const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (message.trim()) {
//       // Handle message sending logic here
//       console.log("Sending message:", message);
//       setMessage("");
//     }
//   };

//   return (
//     <div className="flex gap-6">
//       <LeftPanel members={members} selected={null} />

//       {/* Channel chat section */}
//       <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col relative">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
//                 <Hash size={20} className="text-white" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   Hub Channel
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   General discussions and collaboration
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <Users size={16} />
//                 <span>{members.length} members</span>
//               </div>
//               <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                 <MoreHorizontal size={18} className="text-gray-600" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {hubChannelMessages.map((msg) => (
//             <div
//               key={msg.id}
//               className="group relative"
//               onMouseEnter={() => setHoveredMessage(msg.id)}
//               onMouseLeave={() => setHoveredMessage(null)}
//             >
//               <div className="flex items-start gap-4">
//                 <div
//                   className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
//                   style={{ backgroundColor: msg.color }}
//                 >
//                   {getInitials(msg.name)}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="font-semibold text-gray-800">
//                       {msg.name}
//                     </span>
//                     <span className="text-xs text-gray-500">{msg.time}</span>
//                   </div>

//                   <div className="text-gray-700 leading-relaxed text-sm mb-2">
//                     {msg.text}
//                   </div>

//                   {/* Reactions */}
//                   {msg.reactions.length > 0 && (
//                     <div className="flex gap-2 mt-2">
//                       {msg.reactions.map((reaction, idx) => (
//                         <button
//                           key={idx}
//                           className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
//                         >
//                           <span>{reaction.emoji}</span>
//                           <span className="text-gray-600">
//                             {reaction.count}
//                           </span>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Message Actions */}
//               {hoveredMessage === msg.id && (
//                 <div className="absolute top-0 right-0 flex items-center gap-1 bg-white rounded-lg shadow-md border border-gray-200 p-1">
//                   <button
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     title="Add reaction"
//                   >
//                     <Smile size={16} className="text-gray-600" />
//                   </button>
//                   <button
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     title="Reply"
//                   >
//                     <Reply size={16} className="text-gray-600" />
//                   </button>
//                   <button
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     title="More options"
//                   >
//                     <MoreHorizontal size={16} className="text-gray-600" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Message Input */}
//         <div className="p-6 border-t border-gray-100">
//           <form
//             onSubmit={handleSendMessage}
//             className="flex items-center gap-3"
//           >
//             <div
//               className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
//               style={{ backgroundColor: "#0C2340" }}
//             >
//               Me
//             </div>

//             <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
//               <input
//                 type="text"
//                 placeholder="Type a message in #hub-channel..."
//                 className="flex-1 outline-none bg-transparent text-sm"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />

//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                   title="Attach file"
//                 >
//                   <Paperclip size={18} />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                   className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                   title="Add emoji"
//                 >
//                   <Smile size={18} />
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={!message.trim()}
//               className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               title="Send message"
//             >
//               <Send size={18} />
//             </button>
//           </form>

//           {/* Emoji Picker */}
//           {showEmojiPicker && (
//             <div className="absolute bottom-24 right-8 bg-white rounded-lg shadow-lg border border-gray-200 p-4 grid grid-cols-8 gap-2 z-10">
//               {[
//                 "😀",
//                 "😊",
//                 "😂",
//                 "🥰",
//                 "😍",
//                 "🤔",
//                 "😢",
//                 "😡",
//                 "👍",
//                 "👎",
//                 "❤️",
//                 "🔥",
//                 "👏",
//                 "🎉",
//                 "💯",
//                 "🚀",
//               ].map((emoji) => (
//                 <button
//                   key={emoji}
//                   onClick={() => {
//                     setMessage((prev) => prev + emoji);
//                     setShowEmojiPicker(false);
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-lg text-lg transition-colors"
//                 >
//                   {emoji}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Typing indicator placeholder */}
//         <div className="px-6 pb-2">
//           <div className="text-xs text-gray-500">
//             {/* You can add typing indicators here */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// src/pages/messages-page/HubChannel.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  Hash,
  Users,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import LeftPanel from "../../components/member/LeftPanel";
import { useHubMessages } from "../../hooks/useHubMessages";
import { useAuth } from "../../hooks/useAuth";
import type { HubMessage } from "../../types/chat.types";

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
      className={`${size} rounded-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br from-[#0C2340] to-[#1a3a5c] flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const MessageSkeleton: React.FC = () => (
  <div className="flex items-start gap-4 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex gap-2">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-12" />
      </div>
      <div className="h-10 bg-gray-200 rounded-2xl w-3/4" />
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

// ── Message row ───────────────────────────────────────────────────────────────

interface HubRowProps {
  msg: HubMessage;
  isMe: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const HubMessageRow: React.FC<HubRowProps> = ({
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

  const senderName =
    `${msg.sender.firstName} ${msg.sender.lastName}`.trim() || "Unknown";

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
        className={`group relative flex items-start gap-4 px-3 py-2 rounded-xl transition-colors ${
          hovered ? "bg-gray-50" : ""
        } ${isTemp ? "opacity-60" : "opacity-100"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Avatar image={msg.sender.image} name={senderName} />

        <div className="flex-1 min-w-0">
          {/* Name + time */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-gray-800 text-sm">
              {senderName}
            </span>
            <span className="text-xs text-gray-400">
              {formatTime(msg.timestamp)}
            </span>
            {isTemp && (
              <span className="text-xs text-gray-400 italic">sending…</span>
            )}
          </div>

          {/* Edit mode */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
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
            <p className="text-sm text-gray-700 leading-relaxed">
              {msg.content}
              {isEdited && (
                <span className="text-xs text-gray-400 ml-1.5"></span>
              )}
            </p>
          )}

          {/* Relative timestamp */}
          <span className="text-xs text-gray-400 mt-1 block">
            {formatRelative(msg.timestamp)}
          </span>
        </div>

        {/* Hover actions */}
        {hovered && !isTemp && !isEditing && (
          <div className="absolute top-1 right-2 flex items-center gap-1 bg-white rounded-lg shadow-md border border-gray-200 p-1">
            {isMe && (
              <button
                onClick={() => {
                  setEditText(msg.content);
                  setEditingId(msg.id);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Pencil size={13} className="text-gray-500" />
              </button>
            )}
            {isMe && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={13} className="text-red-400" />
              </button>
            )}
            <button
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="More options"
            >
              <MoreHorizontal size={13} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export const HubChannel: React.FC = () => {
  const { user } = useAuth();
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
  } = useHubMessages();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    await sendMessage(inputMsg.trim());
    setInputMsg("");
  };

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

  const participantCount = new Set(messages.map((m) => m.senderId)).size;

  return (
    <div className="flex gap-6 h-full">
      <LeftPanel />

      <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Hash size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Hub Channel</h2>
                <p className="text-xs text-gray-500">
                  General discussions and collaboration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Users size={14} />
                <span>{participantCount} active</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-100 px-6 py-2 text-sm text-red-600 flex-shrink-0">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {isLoading ? (
            <div className="space-y-4">
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-3">
              <Hash size={40} className="text-gray-200" />
              <p className="font-medium">No messages yet in #hub-channel</p>
              <p className="text-xs">Be the first to say something!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <HubMessageRow
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
                placeholder="Type a message in #hub-channel..."
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
              className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

        {/* Typing indicator space */}
        <div className="px-6 pb-2 h-5 flex-shrink-0" />
      </div>
    </div>
  );
};
