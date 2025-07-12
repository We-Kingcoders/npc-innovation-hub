import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import BlogTable from "../../components/admin-components/BlogTable";

export default function blogs() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar user={{ name: "Admin" }} />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <h1 className="font-bold text-2xl mb-8 ml-8">Blogs</h1>
        <BlogTable />
      </main>
    </div>
  );
}
