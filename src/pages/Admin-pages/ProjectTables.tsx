/**
 * ProjectTables Page
 * Main admin page for project management
 */

import AdminLayout from "../../components/admin-components/AdminLayout";
import ProjectsTable from "../../components/admin-components/ProjectsTable";

export default function ProjectTables() {
  return (
    <AdminLayout title="Projects">
      <ProjectsTable />
    </AdminLayout>
  );
}
