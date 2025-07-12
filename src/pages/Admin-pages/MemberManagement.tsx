import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import MembersManagement from "../../components/admin-components/MembersManagement";

export default function members() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar user={{ name: "Admin" }} />
      <main className="flex-1 px-10 py-8">
        <Topbar />

        <MembersManagement />
      </main>
    </div>
  );
}
