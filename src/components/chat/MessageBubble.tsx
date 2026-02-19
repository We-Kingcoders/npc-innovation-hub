// src/components/chat/MessageBubble.tsx

import React, { useState } from "react";
import { Reply, Pencil, Trash2, Check, X, CornerUpLeft } from "lucide-react";
import ChatAvatar from "./ChatAvatar";
import { formatMessageTime, formatFullTimestamp } from "../../utils/chatUtils";

export interface ReplyRef {
  id: string;
  senderName: string;
  content: string;
}

export interface BubbleMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
  isDeleted?: boolean;
  updatedAt?: string;
  createdAt?: string;
  replyTo?: ReplyRef | null;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
}

interface MessageBubbleProps {
  msg: BubbleMessage;
  isMe: boolean;
  showAvatar: boolean;
  isGroupStart: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReply: (msg: BubbleMessage) => void;
  use24h?: boolean;
}

// ── Delete Confirm ──────────────────────────────────────────────────────────

const DeleteConfirm: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
      <h3 className="text-base font-bold text-gray-800 mb-2">Delete Message</h3>
      <p className="text-sm text-gray-500 mb-5">
        This action cannot be undone.
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

// ── Main ────────────────────────────────────────────────────────────────────

const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  isMe,
  showAvatar,
  isGroupStart,
  editingId,
  setEditingId,
  onEdit,
  onDelete,
  onReply,
  use24h = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editText, setEditText] = useState(msg.content);
  const [showTooltip, setShowTooltip] = useState(false);

  const isEditing = editingId === msg.id;
  const isTemp = msg.id.startsWith("temp-");
  const isEdited =
    msg.updatedAt && msg.createdAt && msg.updatedAt !== msg.createdAt;

  const senderName = isMe
    ? "You"
    : `${msg.sender.firstName} ${msg.sender.lastName}`.trim() || "Unknown";

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== msg.content) {
      onEdit(msg.id, trimmed);
    } else {
      setEditingId(null);
    }
  };

  // ── Soft-deleted message ────────────────────────────────────────────────
  if (msg.isDeleted) {
    return (
      <div
        className={`flex ${isMe ? "justify-end" : "justify-start"} px-4 py-0.5`}
      >
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-gray-100 border border-dashed border-gray-300">
          <Trash2 size={11} className="text-gray-400" />
          <span className="text-xs text-gray-400 italic">
            This message was deleted
          </span>
        </div>
      </div>
    );
  }

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
        className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2 px-4 ${
          isGroupStart ? "pt-3" : "pt-0.5"
        } ${isTemp ? "opacity-60" : "opacity-100"} transition-opacity group`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Avatar — only show on group start or last in group */}
        <div className="w-9 flex-shrink-0 flex items-end">
          {showAvatar && !isMe ? (
            <ChatAvatar image={msg.sender.image} name={senderName} size="sm" />
          ) : null}
        </div>

        {/* Bubble column */}
        <div
          className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
        >
          {/* Sender name (group start only, not me) */}
          {isGroupStart && !isMe && (
            <span className="text-xs font-semibold text-gray-500 mb-1 ml-1">
              {senderName}
            </span>
          )}

          {/* Reply reference */}
          {msg.replyTo && (
            <div
              className={`flex items-start gap-1.5 mb-1 px-2 py-1.5 rounded-lg border-l-2 border-blue-400 bg-blue-50 text-xs max-w-full ${
                isMe ? "self-end" : "self-start"
              }`}
            >
              <CornerUpLeft
                size={10}
                className="text-blue-400 mt-0.5 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold text-blue-600 truncate">
                  {msg.replyTo.senderName}
                </p>
                <p className="text-gray-500 truncate">{msg.replyTo.content}</p>
              </div>
            </div>
          )}

          {/* Edit mode */}
          {isEditing ? (
            <div className="flex flex-col gap-2 w-full min-w-[220px]">
              <input
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="text-sm border border-blue-400 rounded-xl px-3 py-2 outline-none w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Check size={10} /> Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={10} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Message bubble */
            <div
              className={`relative px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                isMe
                  ? "bg-[#0C2340] text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          )}

          {/* Footer: time + edited + read receipt */}
          {!isEditing && (
            <div
              className={`flex items-center gap-1 mt-0.5 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {formatMessageTime(msg.timestamp, use24h)}
                </button>
                {showTooltip && (
                  <div className="absolute bottom-5 left-0 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-20 shadow-lg">
                    {formatFullTimestamp(msg.timestamp)}
                  </div>
                )}
              </div>
              {isEdited && (
                <span className="text-xs text-gray-400 italic">· edited</span>
              )}
              {isTemp && (
                <span className="text-xs text-gray-400">· sending…</span>
              )}
              {/* Read receipt */}
              {isMe && !isTemp && (
                <span className="text-xs">
                  {msg.isRead ? (
                    <span className="text-blue-400">✓✓</span>
                  ) : (
                    <span className="text-gray-400">✓</span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hover action toolbar */}
        {hovered && !isTemp && !isEditing && (
          <div
            className={`flex items-center gap-0.5 self-center bg-white rounded-lg shadow-md border border-gray-200 p-0.5 flex-shrink-0 ${
              isMe ? "mr-1" : "ml-1"
            }`}
          >
            <button
              onClick={() => onReply(msg)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              title="Reply"
            >
              <Reply size={13} className="text-gray-500" />
            </button>
            {isMe && (
              <button
                onClick={() => {
                  setEditText(msg.content);
                  setEditingId(msg.id);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                title="Edit"
              >
                <Pencil size={13} className="text-gray-500" />
              </button>
            )}
            {isMe && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                title="Delete"
              >
                <Trash2 size={13} className="text-red-400" />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MessageBubble;
