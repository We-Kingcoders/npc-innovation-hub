// src/components/admin-components/AdminChatLayout.tsx
//
// A thin wrapper that places the admin Sidebar + a bounded main area
// so chat components (which rely on h-full) work correctly.
// Used only by /admin/messages and /admin/hub-channel routes.

import React from "react";
import Sidebar from "./Sidebar";

interface AdminChatLayoutProps {
  children: React.ReactNode;
}

const AdminChatLayout: React.FC<AdminChatLayoutProps> = ({ children }) => {
  return (
    // Full viewport height, no overflow on the outer shell
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar — fixed width, full height */}
      <Sidebar />

      {/* Main area — fills remaining space, bounded height */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Padding wrapper — gives the chat a proper bounded box */}
        <div className="flex-1 min-h-0 p-6 flex flex-col overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminChatLayout;
