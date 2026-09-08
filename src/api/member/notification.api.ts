// src/api/member/notification.api.ts
//
// Client for the backend's real notification system
// (src/models/notification.model.ts, src/controllers/notification.controller.ts,
// mounted at /api/notifications). Works the same for both Member and Admin
// roles - the backend scopes every query to the authenticated user.

import apiClient from "../client";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedEntityId?: string | null;
  relatedEntityType?: string | null;
  priority: NotificationPriority;
  senderId?: string | null;
  messageId?: string | null;
  roomId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsListResponse {
  status: string;
  data: {
    notifications: AppNotification[];
    unreadCount: number;
    total: number;
    currentPage: number;
    totalPages: number;
  };
}

interface UnreadCountResponse {
  status: string;
  data: { unreadCount: number };
}

const BASE = "/api/notifications";

export const getNotifications = async (
  page = 1,
  limit = 20,
): Promise<NotificationsListResponse["data"]> => {
  const res = await apiClient.get<NotificationsListResponse>(BASE, {
    params: { page, limit },
  });
  return res.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const res = await apiClient.get<UnreadCountResponse>(`${BASE}/unread-count`);
  return res.data.data.unreadCount;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await apiClient.patch(`${BASE}/${id}/mark-read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.patch(`${BASE}/mark-all-read`);
};

export const deleteNotification = async (id: string): Promise<void> => {
  await apiClient.delete(`${BASE}/${id}`);
};
