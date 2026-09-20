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
    badge: 6,
  },
  {
    label: "Resources",
    icon: <FolderOpen size={18} strokeWidth={2.5} />,
    path: "/dashboard/resources",
    badge: 5,
  },
  {
    label: "Projects",
    icon: <Briefcase size={18} strokeWidth={2.5} />,
    path: "/dashboard/projects",
    badge: 30,
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
    badge: 6,
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

export const Sidebar: React.FC = () => <SidebarShell links={links} />;
