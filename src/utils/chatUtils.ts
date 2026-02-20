// src/utils/chatUtils.ts

// ── Date / time formatting ────────────────────────────────────────────────────

export const formatMessageTime = (iso: string, use24h = false): string => {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    if (use24h) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

export const formatFullTimestamp = (iso: string): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString([], {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const formatRelativeTime = (iso: string): string => {
  if (!iso) return "";
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
    return `${Math.floor(diffMin / 1440)}d ago`;
  } catch {
    return "";
  }
};

// ── Date separator label ──────────────────────────────────────────────────────

export const getDateSeparatorLabel = (iso: string): string => {
  if (!iso) return "";
  try {
    const msgDate = new Date(iso);
    const now = new Date();

    const toMidnight = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    const diffDays = Math.round(
      (toMidnight(now) - toMidnight(msgDate)) / 86_400_000,
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return msgDate.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

export const isSameDay = (isoA: string, isoB: string): boolean => {
  try {
    const a = new Date(isoA);
    const b = new Date(isoB);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  } catch {
    return false;
  }
};

// ── Message grouping ──────────────────────────────────────────────────────────
// Messages from the same sender within 2 minutes are "grouped" (avatar hidden on middle ones)

export const shouldShowAvatar = <
  T extends { senderId: string; timestamp: string },
>(
  messages: T[],
  index: number,
): boolean => {
  if (index === messages.length - 1) return true;
  const curr = messages[index];
  const next = messages[index + 1];
  if (curr.senderId !== next.senderId) return true;
  const diffMs =
    new Date(next.timestamp).getTime() - new Date(curr.timestamp).getTime();
  return diffMs > 2 * 60 * 1000;
};

export const isGroupStart = <T extends { senderId: string; timestamp: string }>(
  messages: T[],
  index: number,
): boolean => {
  if (index === 0) return true;
  const curr = messages[index];
  const prev = messages[index - 1];
  if (curr.senderId !== prev.senderId) return true;
  const diffMs =
    new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime();
  return diffMs > 2 * 60 * 1000;
};
