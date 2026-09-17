/**
 * Alumni Management Page
 *
 * Admin page for managing the alumni directory shown on the public
 * site (create/edit/delete entries). Promoting/demoting an existing
 * member to alumni status is done from the Members page instead.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import AdminLayout from "../../components/admin-components/AdminLayout";
import AlumniManagement from "../../components/admin-components/AlumniManagement";

const AlumniManagementPage: React.FC = () => {
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
            <h1 className="font-bold text-2xl mb-2 text-navy-800">Alumni</h1>
            <p className="text-sm text-mist-600">
              Manage the alumni directory shown on the public site. To promote
              or demote an existing member, use the Members page.
            </p>
          </div>
        }
      >
        <AlumniManagement />
      </AdminLayout>
    </>
  );
};

export default AlumniManagementPage;
