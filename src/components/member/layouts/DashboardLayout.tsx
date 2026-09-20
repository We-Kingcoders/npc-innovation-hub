import React from "react";
import { Sidebar } from "../Sidebar";
import { Topbar } from "../Topbar";
import SkipToContent from "../../SkipToContent";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    // flex min-h-screen directly on the row (matching AdminDashboard.tsx's
    // own wrapper) - not a flex-col shell with a margin-topped row inside
    // it. That extra `mt-6` used to clear a full-width <Header/> rendered
    // above this row; the header is long gone but the margin stayed,
    // which broke the sidebar's `sticky` on any page short enough that
    // the row's height ends up exactly equal to the sidebar's own
    // h-dvh - sticky needs the row to be taller than the sidebar to have
    // any room to "stick" in, and the leftover margin was quietly
    // guaranteeing that never happened on the shorter pages.
    <div className="flex min-h-screen bg-mist-100">
      <SkipToContent />
      <Sidebar />

      {/* min-w-0: without it a flex-1 box refuses to shrink below its
          content's natural width - e.g. the wide ProjectTable/ResourceTable
          at /dashboard/projects and /dashboard/resources - forcing this
          column, and the page, wider than the viewport. */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        {/* px-10 (40px) unconditionally cost a 320px phone 80px of
            width - a quarter of the screen - before any content even
            started. Matches Topbar's own px-4 sm:px-10 scale. */}
        <main id="main-content" className="flex-1 px-4 sm:px-10 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};
