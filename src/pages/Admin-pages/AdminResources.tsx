import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import ResourceTable from "../../components/admin-components/ResourceTable";

export default function Resources() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar user={{ name: "Admin" }} />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <h1 className="font-bold text-2xl mb-8">Resource management</h1>
        <ResourceTable />
      </main>
    </div>
  );
}
