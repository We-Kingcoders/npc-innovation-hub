/**
 * ApplicationsPage
 * Main admin page for reviewing membership applications
 */

import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import ApplicationsList from "../../components/admin-components/ApplicationsList";

export default function ApplicationsPage() {
  return (
    <div className="flex min-h-screen bg-mist-100">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bold text-2xl">Membership Applications</h1>
          <div className="text-sm text-gray-600">
            Review and decide on Join Us applications
          </div>
        </div>
        <ApplicationsList />
      </main>
    </div>
  );
}
