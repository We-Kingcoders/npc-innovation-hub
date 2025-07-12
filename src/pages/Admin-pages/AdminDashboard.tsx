import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import DashboardStats from "../../components/admin-components/DashboardStats";
import DashboardStatsSecondary from "../../components/admin-components/DashboardStatsSecondary";
import RevenueWidget from "../../components/admin-components/RevenueWidget";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar user={{ name: "Admin" }} />
      <main className="flex-1 px-10 py-8">
        <Topbar />
        <h1 className="font-bold text-2xl mb-8">Dashboard</h1>
        <div className="bg-white rounded-2xl p-8">
          <DashboardStats />
          <DashboardStatsSecondary />
          <RevenueWidget />
        </div>
      </main>
    </div>
  );
}
