// src/pages/Admin-pages/AdminContactMessages.tsx
//
// Reached via the "Messages" sidebar entry -> the "Contact Messages"
// shortcut in AdminChatLeftPanel (alongside Hub Channel and Direct
// Messages). Same two-pane shell as AdminMessages.tsx/AdminHubChannel.tsx
// (left panel + main content), but the main content is ContactMessagesPanel
// instead of the live ChatShell - contact form submissions aren't a
// back-and-forth chat thread.
import React from "react";
import { Toaster } from "react-hot-toast";
import AdminChatLeftPanel from "../../components/chat/AdminChatLeftPanel";
import ContactMessagesPanel from "../../components/chat/ContactMessagesPanel";

const AdminContactMessages: React.FC = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <div className="flex gap-4 h-full min-h-0">
        <div className="hidden md:block md:flex-shrink-0">
          <AdminChatLeftPanel basePath="/admin" />
        </div>
        <div className="flex-1 min-w-0 min-h-0">
          <ContactMessagesPanel />
        </div>
      </div>
    </>
  );
};

export default AdminContactMessages;
