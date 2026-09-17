// src/components/admin-components/AdminLayout.tsx
//
// Shared shell for admin pages - Sidebar + Topbar + a standard title/actions
// header row. Every admin page used to duplicate this markup individually,
// which is how `min-w-0` ended up missing from `<main>` on 14 of them (the
// other half of the Sidebar overlap/overflow bug: a fixed-width Sidebar
// sibling plus a flex-1 main with no min-w-0 lets main refuse to shrink
// below its content's natural width, forcing the whole row - and the page -
// wider than the viewport).
//
// AdminDashboard.tsx and AdminChatLayout.tsx intentionally do NOT use this -
// both have their own different content-area shape (a scroll region, and a
// bounded h-dvh chat shell) that doesn't fit this component's assumptions.

import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import SkipToContent from "../SkipToContent";

interface AdminLayoutProps {
  children: ReactNode;
  // ReactNode, not string: several pages pair the title with a subtitle
  // paragraph (see TaskManagement.tsx, AddResource.tsx) - callers pass
  // that as a small <div> instead of AdminLayout needing its own
  // subtitle prop.
  title?: ReactNode;
  actions?: ReactNode;
}

export default function AdminLayout({
  children,
  title,
  actions,
}: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-mist-100">
      <SkipToContent />
      <Sidebar />

      <main id="main-content" className="flex-1 min-w-0 px-4 sm:px-10 py-8">
        <Topbar />

        {title && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            {typeof title === "string" ? (
              <h1 className="font-bold text-2xl">{title}</h1>
            ) : (
              title
            )}
            {actions}
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
