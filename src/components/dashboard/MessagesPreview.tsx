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

const AVATAR_COLORS = [
  "from-purple-500 to-indigo-600",
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-teal-500",
  "from-orange-400 to-amber-500",
];

const MessagesPreview: React.FC<MessagesPreviewProps> = ({
  conversations,
  loading,
}) => {
  const navigate = useNavigate();
  const displayed = conversations.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-gray-900">Messages</h3>
        <button
          onClick={() => navigate("/hub-channel")}
          className="flex items-center gap-1 text-xs text-indigo-600
                     hover:text-indigo-800 font-semibold transition-colors"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1">
                <div className="h-3.5 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-gray-400 gap-2">
          <MessageSquare size={28} className="opacity-30" />
          <p className="text-sm">No conversations yet.</p>
          <button
            onClick={() => navigate("/hub-channel")}
            className="text-xs text-indigo-600 hover:underline font-medium"
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
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50
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
                                   bg-green-500 rounded-full border-2 border-white"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {conv.firstName} {conv.lastName}
                  </span>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                    {timeAgo(conv.lastMessageTime)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {conv.lastMessage}
                </p>
              </div>

              {/* Unread badge */}
              {conv.unreadCount > 0 && (
                <span
                  className="shrink-0 w-5 h-5 bg-indigo-600 text-white
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
