/**
 * EventTables Page
 * Main admin page for event management
 */

import AdminLayout from "../../components/admin-components/AdminLayout";
import EventsTable from "../../components/admin-components/EventsTable";

export default function EventTables() {
  return (
    <AdminLayout title="Events">
      <EventsTable />
    </AdminLayout>
  );
}
