import React from "react";
import { Sidebar } from "../Sidebar";
import { Topbar } from "../Topbar";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9FB]">
      {/* Full width Header on top */}

      {/* Below Header: sidebar + main content */}
      <div className="flex flex-1 mt-6">
        {/* Sidebar on left, fixed width */}
        <Sidebar />

        {/* Right side: Topbar + main page content */}
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 px-10 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
