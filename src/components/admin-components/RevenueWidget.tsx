import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../data/admin-data/dashboardStats";
import type { DashboardStat } from "../../data/admin-data/dashboardStats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface EnhancedDashboardStat extends DashboardStat {
  year: number;
  month: string;
  revenue: number;
  previousRevenue?: number;
}

export default function RevenueWidget() {
  const [stats, setStats] = useState<EnhancedDashboardStat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data as EnhancedDashboardStat[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Generate available years from data or use current year as default
  const availableYears =
    stats.length > 0
      ? [...new Set(stats.map((stat) => stat.year))].sort((a, b) => b - a)
      : [selectedYear];

  // Filter data for selected year
  const filteredData = stats.filter((stat) => stat.year === selectedYear);

  // Check if we have any data for the selected year
  const hasDataForSelectedYear = filteredData.length > 0;

  // Calculate totals only if data exists
  const currentYearTotal = hasDataForSelectedYear
    ? filteredData.reduce((sum, item) => sum + item.revenue, 0)
    : 0;

  const previousYearData = stats.filter(
    (stat) => stat.year === selectedYear - 1,
  );
  const previousYearTotal = previousYearData.reduce(
    (sum, item) => sum + (item.revenue || 0),
    0,
  );

  // Calculate growth percentage (handle division by zero)
  const growthPercent =
    previousYearTotal > 0
      ? Math.round(
          ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100,
        )
      : currentYearTotal > 0
        ? 100
        : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle case when no data exists at all
  if (!stats.length) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No revenue data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no revenue records available.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-white shadow-sm rounded-lg p-6 gap-8 w-full">
      {/* Chart Section */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Revenue Analysis
          </h2>
          <div className="flex items-center space-x-2">
            <label
              htmlFor="year-select"
              className="text-sm font-medium text-gray-500"
            >
              Year:
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-700 py-1 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasDataForSelectedYear ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  formatter={(value) => [
                    `$${Number(value).toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelFormatter={(label) => `${label} ${selectedYear}`}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  name="Monthly Revenue"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No data for {selectedYear}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select another year from the dropdown above
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="lg:w-72 xl:w-80 flex flex-col items-center lg:items-start lg:pl-8 lg:border-l lg:border-gray-100">
        <div className="w-full max-w-xs mb-8">
          <div className="w-40 h-40 mx-auto">
            <CircularProgressbar
              value={Math.abs(growthPercent)}
              text={`${growthPercent}%`}
              styles={{
                path: {
                  stroke: growthPercent >= 0 ? "#4f46e5" : "#ef4444",
                  strokeLinecap: "round",
                },
                trail: {
                  stroke: "#e5e7eb",
                },
                text: {
                  fill: growthPercent >= 0 ? "#4f46e5" : "#ef4444",
                  fontSize: "28px",
                  fontWeight: "bold",
                },
              }}
            />
          </div>
          <div className="text-center mt-4">
            <p className="text-lg font-medium text-gray-700">
              {growthPercent >= 0 ? "Revenue Growth" : "Revenue Decline"}
            </p>
            <p className="text-sm text-gray-500">Year over Year Comparison</p>
          </div>
        </div>

        <div className="w-full space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Current Year
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  ${(currentYearTotal / 1000).toFixed(1)}k
                </p>
              </div>
              <div className="bg-indigo-100 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Previous Year
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  ${(previousYearTotal / 1000).toFixed(1)}k
                </p>
              </div>
              <div className="bg-gray-200 rounded-full p-2">
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
