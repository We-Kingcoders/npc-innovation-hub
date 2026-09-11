import React from "react";
import { Sidebar } from "../Sidebar";
import { Topbar } from "../Topbar";
import SkipToContent from "../../SkipToContent";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-mist-100">
      <SkipToContent />
      {/* Full width Header on top */}

      {/* Below Header: sidebar + main content */}
      <div className="flex flex-1 mt-6">
        {/* Sidebar on left, fixed width */}
        <Sidebar />

        {/* Right side: Topbar + main page content */}
        <div className="flex-1 flex flex-col">
          <Topbar />
          {/* px-10 (40px) unconditionally cost a 320px phone 80px of
              width - a quarter of the screen - before any content even
              started. Matches Topbar's own px-4 sm:px-10 scale. */}
          <main id="main-content" className="flex-1 px-4 sm:px-10 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
