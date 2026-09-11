/**
 * Hub Video Page
 *
 * Admin page for uploading, replacing, and removing the intro video
 * shown on the public landing page.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import HubVideoManagement from "../../components/admin-components/HubVideoManagement";

const HubVideoPage: React.FC = () => {
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
            Hub Intro Video
          </h1>
          <p className="text-sm text-mist-600 mb-8 ml-0 md:ml-8">
            Manage the intro video shown on the public landing page.
          </p>
          <HubVideoManagement />
        </main>
      </div>
    </>
  );
};

export default HubVideoPage;
