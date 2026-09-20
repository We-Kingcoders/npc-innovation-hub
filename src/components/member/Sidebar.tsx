// src/components/member/Sidebar.tsx
// Member's own nav items wired into the shared shell in
// components/ui/Sidebar.tsx (the same shell Admin uses) - only the data
// differs, keeping the two surfaces' behavior identical by construction
// instead of by hand-copied styling that can drift apart again.

import React from "react";
import {
  LayoutDashboard,
  Bell,
  FolderOpen,
  Briefcase,
  MessageSquare,
  Calendar,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import SidebarShell, { type SidebarLinkItem } from "../ui/Sidebar";
import { useNotifications } from "../../hooks/useNotifications";

export const Sidebar: React.FC = () => {
  // Real unread-notification count - the same live-polled/socket-pushed
  // hook NotificationBell uses, not a hardcoded placeholder. Resources,
  // Projects, and Events used to carry static badges (5/30/6) that never
  // corresponded to any real count - matching Admin's own actual
  // behavior instead: Admin's sidebar only badges the one thing it has a
  // genuine live count for (pending hire inquiries) and leaves every
  // other item unbadged rather than showing a total-count number that
  // isn't a "pending/unread" signal at all.
  const { unreadCount } = useNotifications();

  const links: SidebarLinkItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} strokeWidth={2.5} />,
      path: "/dashboard",
      // "/dashboard" is itself a prefix of every other Member route below -
      // without `end`, Dashboard would render "active" on all of them too.
      end: true,
    },
    {
      label: "Notifications",
      icon: <Bell size={18} strokeWidth={2.5} />,
      path: "/notifications",
      badge: unreadCount,
    },
    {
      label: "Resources",
      icon: <FolderOpen size={18} strokeWidth={2.5} />,
      path: "/dashboard/resources",
    },
    {
      label: "Projects",
      icon: <Briefcase size={18} strokeWidth={2.5} />,
      path: "/dashboard/projects",
    },
    {
      label: "Messages",
      icon: <MessageSquare size={18} strokeWidth={2.5} />,
      path: "/hub-channel",
    },
    {
      label: "Events",
      icon: <Calendar size={18} strokeWidth={2.5} />,
      path: "/dashboard/events",
    },
    {
      label: "Blog",
      icon: <BookOpen size={18} strokeWidth={2.5} />,
      path: "/blog",
    },
    {
      label: "My Tasks",
      icon: <ClipboardList size={18} strokeWidth={2.5} />,
      path: "/dashboard/tasks",
    },
  ];

  return <SidebarShell links={links} />;
};
