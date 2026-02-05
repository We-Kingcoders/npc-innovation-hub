// import Sidebar from "../../components/admin-components/Sidebar";
// import Topbar from "../../components/admin-components/Topbar";
// import MembersManagement from "../../components/admin-components/MembersManagement";

// export default function members() {
//   return (
//     <div className="flex min-h-screen bg-[#f7f8fa]">
//       <Sidebar user={{ name: "Admin" }} />
//       <main className="flex-1 px-10 py-8">
//         <Topbar />

//         <MembersManagement />
//       </main>
//     </div>
//   );
// }

/**
 * Member Management Page (Updated)
 *
 * Admin page for managing all users in the system.
 * Uses the new MembersManagement component with API integration.
 */

import React from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import MembersManagement from "../../components/admin-components/MembersManagement";

// ==================== COMPONENT ====================

const MemberManagement: React.FC = () => {
  return (
    <>
      {/* Toast Notifications */}
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

      <div className="flex min-h-screen bg-[#f7f8fa]">
        {/* Sidebar */}
        <Sidebar user={{ name: "Admin" }} />

        {/* Main Content */}
        <main className="flex-1 px-10 py-8">
          <Topbar />
          <MembersManagement />
        </main>
      </div>
    </>
  );
};

export default MemberManagement;
