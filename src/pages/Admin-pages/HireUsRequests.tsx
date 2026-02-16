/**
 * HireUsRequests Page
 * Main admin page for managing hire inquiries
 */

import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import HireRequests from "../../components/admin-components/HireRequests";

export default function HireUsRequests() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bold text-2xl">Hire Us Inquiries</h1>
          <div className="text-sm text-gray-600">
            Manage and respond to client inquiries
          </div>
        </div>
        <HireRequests />
      </main>
    </div>
  );
}
