// ============================================================
// SystemHealth.tsx
// API health indicators with latency and status pills
// ============================================================

import React from "react";
import type { SystemHealthIndicator } from "../../../types/dashboard.types";

interface SystemHealthProps {
  health: SystemHealthIndicator[];
  loading: boolean;
  onRefresh?: () => void;
}

const STATUS_CONFIG = {
  healthy: {
    label: "Healthy",
    dot: "bg-emerald-400",
    ring: "ring-emerald-200",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    pulse: true,
  },
  degraded: {
    label: "Degraded",
    dot: "bg-amber-400",
    ring: "ring-amber-200",
    text: "text-amber-700",
    bg: "bg-amber-50",
    pulse: false,
  },
  down: {
    label: "Down",
    dot: "bg-rose-400",
    ring: "ring-rose-200",
    text: "text-rose-700",
    bg: "bg-rose-50",
    pulse: false,
  },
};

function getLatencyColor(latency: number): string {
  if (latency === 0) return "text-rose-500";
  if (latency < 200) return "text-emerald-600";
  if (latency < 500) return "text-amber-600";
  return "text-rose-600";
}

const SkeletonRow: React.FC = () => (
  <div className="flex items-center justify-between py-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-gray-200 rounded-full" />
      <div className="w-28 h-3 bg-gray-200 rounded" />
    </div>
    <div className="flex items-center gap-3">
      <div className="w-14 h-3 bg-gray-200 rounded" />
      <div className="w-14 h-5 bg-gray-200 rounded-full" />
    </div>
  </div>
);

const SystemHealth: React.FC<SystemHealthProps> = ({
  health,
  loading,
  onRefresh,
}) => {
  const allHealthy = health.every((h) => h.status === "healthy");
  const hasIssues = health.some(
    (h) => h.status === "degraded" || h.status === "down",
  );

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">System Health</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            API endpoint monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!loading && (
            <span
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1
                ${
                  allHealthy
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : hasIssues
                      ? "bg-rose-50 text-rose-700 ring-rose-200"
                      : "bg-amber-50 text-amber-700 ring-amber-200"
                }
              `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  allHealthy
                    ? "bg-emerald-400 animate-pulse"
                    : hasIssues
                      ? "bg-rose-400"
                      : "bg-amber-400"
                }`}
              />
              {allHealthy
                ? "All Systems Go"
                : hasIssues
                  ? "Issues Detected"
                  : "Degraded"}
            </span>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              title="Refresh health check"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Services List */}
      <div className="divide-y divide-gray-50">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : health.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-400 text-xs">No health data available</p>
          </div>
        ) : (
          health.map((service) => {
            const config = STATUS_CONFIG[service.status];
            const latencyColor = getLatencyColor(service.latency);

            return (
              <div
                key={service.service}
                className="flex items-center justify-between py-3 group"
              >
                {/* Left: Name + endpoint */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${config.dot} ${config.pulse ? "animate-pulse" : ""}`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {service.service}
                    </p>
                    <p className="text-xs text-gray-400 font-mono truncate">
                      {service.endpoint}
                    </p>
                  </div>
                </div>

                {/* Right: Latency + Status */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {service.status !== "down" && service.latency > 0 && (
                    <span
                      className={`text-xs font-mono font-semibold ${latencyColor}`}
                    >
                      {service.latency}ms
                    </span>
                  )}
                  <span
                    className={`
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ring-1
                        ${config.bg} ${config.text} ${config.ring}
                      `}
                  >
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {!loading && health.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {health.filter((h) => h.status === "healthy").length}/
            {health.length} services online
          </span>
          <div className="flex gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              Healthy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              Degraded
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
              Down
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;
