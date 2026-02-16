/**
 * ProjectTables Page
 * Main admin page for project management
 */

import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import ProjectsTable from "../../components/admin-components/ProjectsTable";

export default function ProjectTables() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <h1 className="font-bold text-2xl mb-8 ml-8">Projects</h1>
        <ProjectsTable />
      </main>
    </div>
  );
}
