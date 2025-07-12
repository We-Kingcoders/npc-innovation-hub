import { dashboardStats } from "../../data/admin-data/dashboardStats";

export default function DashboardStatsSecondary() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {dashboardStats.slice(3).map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-6"
        >
          <span className="text-4xl font-bold">{stat.value}</span>
          <span className="text-lg">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
