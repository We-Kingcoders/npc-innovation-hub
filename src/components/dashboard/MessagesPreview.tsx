// src/components/dashboard/MessagesPreview.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";
import type { ConversationPreview } from "../../types/chat.types";

interface MessagesPreviewProps {
  conversations: ConversationPreview[];
  loading: boolean;
}

const timeAgo = (iso: string): string => {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

// Avatar fallbacks vary only in depth of the same dark blue.
const AVATAR_COLORS = [
  "from-navy-600 to-navy-800",
  "from-navy-500 to-navy-700",
  "from-navy-700 to-navy-900",
  "from-navy-400 to-navy-600",
  "from-navy-500 to-navy-800",
];

const MessagesPreview: React.FC<MessagesPreviewProps> = ({
  conversations,
  loading,
}) => {
  const navigate = useNavigate();
  const displayed = conversations.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mist-300 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-navy-800">Messages</h3>
        <button
          onClick={() => navigate("/hub-channel")}
          className="flex items-center gap-1 text-xs text-navy-600
                     hover:text-navy-800 font-semibold transition-colors"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3">
              <div className="w-10 h-10 bg-mist-300 rounded-full shrink-0" />
              <div className="flex-1">
                <div className="h-3.5 bg-mist-300 rounded w-1/2 mb-2" />
                <div className="h-3 bg-mist-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-mist-500 gap-2">
          <MessageSquare size={28} className="text-mist-400" />
          <p className="text-sm">No conversations yet.</p>
          <button
            onClick={() => navigate("/hub-channel")}
            className="text-xs text-navy-600 hover:underline font-medium"
          >
            Open Hub Channel →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map((conv, idx) => (
            <div
              key={conv.userId}
              onClick={() => navigate(`/messages/${conv.userId}`)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-mist-100
                         transition-colors cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className={`w-10 h-10 bg-gradient-to-br
                                  ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}
                                  rounded-full flex items-center justify-center
                                  text-white text-xs font-bold`}
                >
                  {conv.image ? (
                    <img
                      src={conv.image}
                      alt={conv.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    getInitials(conv.firstName, conv.lastName)
                  )}
                </div>
                {conv.isOnline && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3
                                   bg-navy-600 rounded-full border-2 border-white"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-navy-800">
                    {conv.firstName} {conv.lastName}
                  </span>
                  <span className="text-[10px] text-mist-500 shrink-0 ml-2">
                    {timeAgo(conv.lastMessageTime)}
                  </span>
                </div>
                <p className="text-xs text-mist-600 truncate">
                  {conv.lastMessage}
                </p>
              </div>

              {/* Unread badge */}
              {conv.unreadCount > 0 && (
                <span
                  className="shrink-0 w-5 h-5 bg-navy-800 text-white
                                 text-[10px] font-bold rounded-full flex items-center
                                 justify-center"
                >
                  {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPreview;
