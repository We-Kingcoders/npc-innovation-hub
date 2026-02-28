// src/pages/messages-page/Messages.tsx

import React, { useState, useEffect, useCallback } from "react";
import LeftPanel from "../../components/member/LeftPanel";
import { useDirectMessages } from "../../hooks/useDirectMessages";
import { useAuth } from "../../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import type { DirectMessage } from "../../types/chat.types";
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
  msg: DirectMessage,
  getReplyTo: (id: string) => ReplyRef | null,
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

// ── Component ─────────────────────────────────────────────────────────────────

export const Messages: React.FC = () => {
  const { id: paramUserId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    paramUserId ?? null,
  );
  const [selectedMemberName, setSelectedMemberName] = useState<string>("");
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
  } = useDirectMessages(selectedUserId);

  useEffect(() => {
    if (paramUserId) setSelectedUserId(paramUserId);
  }, [paramUserId]);

  const otherUser = (() => {
    for (const m of messages) {
      if (m.senderId !== user?.id) return m.sender;
      if (m.receiverId !== user?.id) return m.receiver;
    }
    return null;
  })();

  const headerName =
    (otherUser
      ? `${otherUser.firstName} ${otherUser.lastName}`.trim()
      : null) ||
    selectedMemberName ||
    "";

  const handleSelectUser = useCallback(
    (userId: string, memberName: string) => {
      setSelectedUserId(userId);
      setSelectedMemberName(memberName);
      setReplyTarget(null);
      navigate(`/messages/${userId}`, { replace: true });
    },
    [navigate],
  );

  // Unused destructured params prefixed with _ to satisfy TS6133
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
  };

  const bubbles: BubbleMessage[] = messages.map((m) => toBubble(m, getReplyTo));

  return (
    <div className="flex gap-4 h-full min-h-0">
      <LeftPanel selectedUserId={selectedUserId} onSelect={handleSelectUser} />
      <div className="flex-1 min-w-0 min-h-0">
        <ChatShell
          headerTitle={headerName || (selectedUserId ? "Conversation" : "")}
          showOnlineStatus
          isSelected={!!selectedUserId}
          noSelectionTitle="Select a conversation"
          noSelectionSubtitle="Choose from the left panel or start a new one with +"
          messages={bubbles}
          currentUserId={user?.id ?? ""}
          isLoading={isLoading}
          error={error}
          isSending={isSending}
          currentUserImage={user?.image ?? null}
          currentUserName={
            user ? `${user.firstName} ${user.lastName}`.trim() : "Me"
          }
          inputPlaceholder={`Message ${headerName || "..."}...`}
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
          messagesEndRef={messagesEndRef}
          emptyTitle="No messages yet"
          emptySubtitle={`Say hello to ${headerName || "your contact"} 👋`}
        />
      </div>
    </div>
  );
};
