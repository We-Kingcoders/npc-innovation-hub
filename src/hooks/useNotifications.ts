// src/hooks/useNotifications.ts
// Shared between Member and Admin — the backend scopes /api/notifications
// to whichever user is authenticated, so one hook/component serves both.

import { useState, useEffect, useCallback, useRef } from "react";
import type { AppNotification } from "../api/member/notification.api";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as apiDeleteNotification,
} from "../api/member/notification.api";

const POLL_INTERVAL_MS = 45_000;

interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedList = useRef(false);

  // Cheap poll: just the unread badge count, not the full list.
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Silent — a failed background poll shouldn't surface as a page error.
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      hasFetchedList.current = true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load notifications";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(() => {
      // Once the dropdown has been opened, keep the visible list current too;
      // otherwise just poll the lightweight badge count.
      if (hasFetchedList.current) {
        fetchNotifications();
      } else {
        refreshUnreadCount();
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications, refreshUnreadCount]);

  const markAsRead = async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    if (target && !target.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    await apiDeleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
