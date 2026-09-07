// src/components/notifications/NotificationBell.tsx
//
// Real notification bell + dropdown, backed by the actual
// /api/notifications endpoints. Used by both the member and admin
// Topbars — the backend already scopes results per authenticated user,
// so one component correctly serves both roles.

import React, { useEffect, useRef, useState } from "react";
import { Bell, Check, Loader2, Trash2 } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { formatRelativeTime } from "../../utils/chatUtils";

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // Load the full list the first time the dropdown opens.
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  // Close on outside click.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2.5 rounded-lg bg-white border border-mist-300 text-navy-700 transition-all duration-200 hover:bg-navy-800 hover:border-navy-800 hover:text-white active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-mist-300 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-mist-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-navy-800">Notifications</h3>
              <p className="text-xs text-mist-500 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                  : "You're all caught up"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-navy-700 hover:text-navy-900 whitespace-nowrap"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-10 text-mist-400">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}

            {!loading && error && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={fetchNotifications}
                  className="mt-2 text-xs text-navy-700 hover:underline font-medium"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="px-4 py-10 text-center">
                <Bell className="h-8 w-8 text-mist-300 mx-auto mb-2" />
                <p className="text-sm text-mist-500">No notifications yet</p>
              </div>
            )}

            {!loading &&
              !error &&
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group px-4 py-3 border-b border-mist-200 transition-colors flex items-start gap-2 ${
                    n.isRead ? "bg-white" : "bg-navy-50/60"
                  }`}
                >
                  <button
                    onClick={() => !n.isRead && markAsRead(n.id)}
                    className="flex-1 text-left"
                  >
                    <p
                      className={`text-sm ${n.isRead ? "text-navy-700" : "text-navy-900 font-medium"}`}
                    >
                      {n.message}
                    </p>
                    <p className="text-xs text-mist-500 mt-1">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </button>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        title="Mark as read"
                        className="p-1 rounded text-mist-400 hover:text-green-600 hover:bg-green-50"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id)}
                      title="Delete"
                      className="p-1 rounded text-mist-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
