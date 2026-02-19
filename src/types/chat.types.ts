// src/types/chat.types.ts

export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  role: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sender: ChatUser;
  receiver: ChatUser;
}

export interface HubMessage {
  id: string;
  senderId: string;
  roomId: string;
  content: string;
  timestamp: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sender: ChatUser;
}

export interface ConversationPreview {
  userId: string;
  firstName: string;
  lastName: string;
  image: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface SendMessagePayload {
  content: string;
}

export interface EditMessagePayload {
  content: string;
}

// API Response wrappers
export interface DirectMessageResponse {
  status: string;
  data: {
    message: DirectMessage;
  };
}

export interface HubMessageResponse {
  status: string;
  data: {
    message: HubMessage;
  };
}

export interface DirectMessagesListResponse {
  status: string;
  data: {
    messages: DirectMessage[];
  };
}

export interface HubMessagesListResponse {
  status: string;
  data: {
    messages: HubMessage[];
  };
}

export interface ConversationsListResponse {
  status: string;
  data: {
    conversations: ConversationPreview[];
  };
}
