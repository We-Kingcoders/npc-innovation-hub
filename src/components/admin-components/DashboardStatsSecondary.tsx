import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../data/admin-data/dashboardStats";
import type { DashboardStat } from "../../data/admin-data/dashboardStats";

export default function DashboardStatsSecondary() {
  const [, setStats] = useState<DashboardStat[]>([]);
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

  if (loading) return <div>Loading dashboard stats...</div>;
  if (error) return <div>Error: {error}</div>;

  // There are no secondary stats, so show a message or nothing
  return <div>No secondary stats available.</div>;
}
