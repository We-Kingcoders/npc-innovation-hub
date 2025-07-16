import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../data/admin-data/dashboardStats";
import type { DashboardStat } from "../../data/admin-data/dashboardStats";

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch stats");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center py-6">Loading dashboard stats...</div>;
  if (error)
    return <div className="text-red-500 text-center py-6">Error: {error}</div>;
  if (!stats.length)
    return <div className="text-center py-6">No stats found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-gray-100 rounded-xl flex flex-col items-center justify-center py-6 shadow-sm"
        >
          <span className="text-4xl font-bold text-blue-800">{stat.value}</span>
          <span className="text-lg text-gray-700">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
