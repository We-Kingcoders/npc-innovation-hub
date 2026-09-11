/**
 * HireUsRequests Page
 * Main admin page for managing hire inquiries
 */

import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import HireRequests from "../../components/admin-components/HireRequests";

export default function HireUsRequests() {
  return (
    <div className="flex min-h-screen bg-mist-100">
      <Sidebar />
      <main id="main-content" className="flex-1 px-4 sm:px-10 py-8">
        <Topbar />
        {/* flex-col below sm - title + subtitle side by side had nowhere
            near enough room at 320-390px and forced an overflow. */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-8">
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
