// src/components/member/Sidebar.tsx
// Member's own nav items wired into the shared shell in
// components/ui/Sidebar.tsx (the same shell Admin uses) - only the data
// differs, keeping the two surfaces' behavior identical by construction
// instead of by hand-copied styling that can drift apart again.

import React from "react";
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  MessageSquare,
  Calendar,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import SidebarShell, { type SidebarLinkItem } from "../ui/Sidebar";

export const Sidebar: React.FC = () => {
  const links: SidebarLinkItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={18} strokeWidth={2.5} />,
      path: "/dashboard",
      // "/dashboard" is itself a prefix of every other Member route below -
      // without `end`, Dashboard would render "active" on all of them too.
      end: true,
    },
    // No "Notifications" nav item: it pointed at a "/notifications" route
    // that was never registered anywhere in AllRoutes.tsx (a dead link),
    // and the Topbar's NotificationBell already fully handles this - full
    // list, mark-as-read, mark-all-read, delete, live badge count - the
    // same way Admin's sidebar has no Notifications entry either and
    // relies solely on its own Topbar bell.
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
