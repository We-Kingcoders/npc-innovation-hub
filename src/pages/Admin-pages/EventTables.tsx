/**
 * EventTables Page
 * Main admin page for event management
 */

import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import EventsTable from "../../components/admin-components/EventsTable";

export default function EventTables() {
  return (
    <div className="flex min-h-screen bg-mist-100">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <h1 className="font-bold text-2xl mb-8 ml-8">Events</h1>
        <EventsTable />
      </main>
    </div>
  );
}
