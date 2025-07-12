import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import AddResourceForm from "../../components/admin-components/AddResourceForm";

export default function AddResource() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar user={{ name: "SAM" }} />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <h1 className="font-bold text-2xl mb-8">Add new resource</h1>
        <AddResourceForm />
      </main>
    </div>
  );
}
