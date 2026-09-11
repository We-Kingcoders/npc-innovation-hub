/**
 * Hero Members Page
 *
 * Admin page for managing which members are featured in the landing
 * page hero section, and in what order.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import HeroMembersManagement from "../../components/admin-components/HeroMembersManagement";

const HeroMembersPage: React.FC = () => {
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
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="flex min-h-screen bg-mist-100">
        <Sidebar />
        <main id="main-content" className="flex-1 px-4 sm:px-10 py-8">
          <Topbar />
          <h1 className="font-bold text-2xl mb-2 ml-0 md:ml-8 text-navy-800">
            Hero Members
          </h1>
          <p className="text-sm text-mist-600 mb-8 ml-0 md:ml-8">
            Manage which members appear in the landing page hero section.
          </p>
          <HeroMembersManagement />
        </main>
      </div>
    </>
  );
};

export default HeroMembersPage;
