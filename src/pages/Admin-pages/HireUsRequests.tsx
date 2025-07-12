import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import HireRequests from "../../components/admin-components/HireRequests";

export default function HireUsRequests() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar user={{ name: "Admin" }} />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <h1 className="font-bold text-2xl mb-8">Hire Us Requests</h1>
        <HireRequests />
      </main>
    </div>
  );
}
