/**
 * Hub Video Page
 *
 * Admin page for uploading, replacing, and removing the intro video
 * shown on the public landing page.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin-components/AdminLayout";
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

      <AdminLayout
        title={
          <div>
            <h1 className="font-bold text-2xl mb-2 text-navy-800">
              Hub Intro Video
            </h1>
            <p className="text-sm text-mist-600">
              Manage the intro video shown on the public landing page.
            </p>
          </div>
        }
      >
        <HubVideoManagement />
      </AdminLayout>
    </>
  );
};

export default HubVideoPage;
