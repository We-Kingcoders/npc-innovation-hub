// src/components/chat/AdminChatLeftPanel.tsx
//
// Left panel for admin chat pages.
// Reuses the same NewConversationModal and conversation hooks,
// but navigates to /admin/messages/:id and /admin/hub-channel.

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Hash, Search, Plus, MessageSquare } from "lucide-react";
import { useConversations } from "../../hooks/useDirectMessages";
import { useAuth } from "../../hooks/useAuth";
import NewConversationModal from "./NewConversationModal";
import type { MemberItem } from "./NewConversationModal";
import { HeaderAvatar } from "./ChatShell";

interface AdminChatLeftPanelProps {
  selectedUserId?: string | null;
  onSelect?: (userId: string, memberName: string) => void;
  basePath?: string; // "/admin" or "/dashboard" etc.
}

const formatTime = (iso: string): string => {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const Skeleton: React.FC = () => (
  <div className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const AdminChatLeftPanel: React.FC<AdminChatLeftPanelProps> = ({
  selectedUserId,
  onSelect,
  basePath = "/admin",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showNewConvo, setShowNewConvo] = useState(false);

  const { conversations, isLoading } = useConversations();
  const isHub = location.pathname === `${basePath}/hub-channel`;

  const filtered = conversations.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  const go = (userId: string, name: string) => {
    if (onSelect) onSelect(userId, name);
    else navigate(`${basePath}/messages/${userId}`);
  };

  const handleModalSelect = (member: MemberItem) => {
    setShowNewConvo(false);
    go(member.id, member.name);
  };

  return (
    <>
      {showNewConvo && user && (
        <NewConversationModal
          currentUserId={user.id}
          onSelect={handleModalSelect}
          onClose={() => setShowNewConvo(false)}
        />
      )}

      {/* Panel — fixed width, full height, own scroll */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-72 h-full flex flex-col flex-shrink-0 overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#0C2340]" />
              <h2 className="font-bold text-base text-gray-800">Messages</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowNewConvo(true)}
              className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group"
              title="New conversation"
            >
              <Plus
                size={16}
                className="text-gray-500 group-hover:text-blue-500 transition-colors"
              />
            </button>
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Hub Channel shortcut */}
        <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={() => navigate(`${basePath}/hub-channel`)}
            className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-xl text-left transition-all ${
              isHub ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
            }`}
          >
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Hash size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm ${isHub ? "text-blue-700" : "text-gray-800"}`}
              >
                Hub Channel
              </p>
              <p className="text-xs text-gray-400 truncate">
                General discussions
              </p>
            </div>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
          </button>
        </div>

        {/* DM section label */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between flex-shrink-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Direct Messages
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {conversations.length}
          </span>
        </div>

        {/* Conversation list — only this scrolls */}
        <div className="flex-1 overflow-y-auto px-2 pb-3 min-h-0">
          {isLoading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6 px-4">
              {search
                ? "No matches."
                : "No conversations yet. Click + to start one."}
            </p>
          ) : (
            <ul className="space-y-0.5">
              {filtered.map((conv) => {
                const fullName =
                  `${conv.firstName} ${conv.lastName}`.trim() || "Unknown";
                const isSelected = selectedUserId === conv.userId;
                const lastMsg =
                  typeof conv.lastMessage === "string" ? conv.lastMessage : "";
                return (
                  <li
                    key={conv.userId}
                    onClick={() => go(conv.userId, fullName)}
                    className={`flex items-center gap-2.5 py-2 px-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50 border border-blue-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <HeaderAvatar name={fullName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={`font-semibold text-xs truncate ${isSelected ? "text-blue-700" : "text-gray-800"}`}
                        >
                          {fullName}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-1 flex-shrink-0">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">
                        {lastMsg || "No messages yet"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 bg-blue-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 font-medium">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminChatLeftPanel;
