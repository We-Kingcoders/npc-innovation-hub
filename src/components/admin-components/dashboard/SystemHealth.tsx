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
    dot: "bg-navy-400",
    ring: "ring-navy-200",
    text: "text-navy-700",
    bg: "bg-navy-50",
    pulse: true,
  },
  degraded: {
    label: "Degraded",
    dot: "bg-navy-600",
    ring: "ring-navy-300",
    text: "text-navy-800",
    bg: "bg-navy-100",
    pulse: false,
  },
  down: {
    label: "Down",
    dot: "bg-navy-900",
    ring: "ring-navy-800",
    text: "text-white",
    bg: "bg-navy-800",
    pulse: false,
  },
};

function getLatencyColor(latency: number): string {
  if (latency === 0) return "text-navy-900";
  if (latency < 200) return "text-navy-500";
  if (latency < 500) return "text-navy-700";
  return "text-navy-900";
}

const SkeletonRow: React.FC = () => (
  <div className="flex items-center justify-between py-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-mist-200 rounded-full" />
      <div className="w-28 h-3 bg-mist-200 rounded" />
    </div>
    <div className="flex items-center gap-3">
      <div className="w-14 h-3 bg-mist-200 rounded" />
      <div className="w-14 h-5 bg-mist-200 rounded-full" />
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
    <div className="bg-white rounded-2xl p-6 border border-mist-300 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-navy-800 text-sm">System Health</h3>
          <p className="text-xs text-mist-500 mt-0.5">
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
                    ? "bg-navy-50 text-navy-700 ring-navy-200"
                    : hasIssues
                      ? "bg-navy-800 text-white ring-navy-800"
                      : "bg-navy-100 text-navy-800 ring-navy-300"
                }
              `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  allHealthy
                    ? "bg-navy-400 animate-pulse"
                    : hasIssues
                      ? "bg-navy-900"
                      : "bg-navy-600"
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
              className="p-1.5 text-mist-500 hover:text-navy-800 hover:bg-mist-100 rounded-lg transition-colors duration-150"
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
      <div className="divide-y divide-mist-200">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : health.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-mist-500 text-xs">No health data available</p>
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
                    <p className="text-xs font-semibold text-navy-700 truncate">
                      {service.service}
                    </p>
                    <p className="text-xs text-mist-500 font-mono truncate">
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
        <div className="mt-4 pt-4 border-t border-mist-200 flex items-center justify-between">
          <span className="text-xs text-mist-500">
            {health.filter((h) => h.status === "healthy").length}/
            {health.length} services online
          </span>
          <div className="flex gap-3 text-xs text-mist-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-navy-400 rounded-full" />
              Healthy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-navy-600 rounded-full" />
              Degraded
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-navy-900 rounded-full" />
              Down
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;
