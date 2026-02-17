// ============================================================
// ModernStatsCards.tsx
// 7-card KPI grid with glassmorphism, growth %, and icons
// ============================================================

import React from "react";
import StatsCard, { StatsCardSkeleton } from "./StatsCard";
import type { GrowthMetric } from "../../../types/dashboard.types";

interface ModernStatsCardsProps {
  metrics: GrowthMetric[];
  loading: boolean;
}

const SKELETON_COUNT = 7;

const ModernStatsCards: React.FC<ModernStatsCardsProps> = ({
  metrics,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!metrics.length) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-2xl mb-6">
        <p className="text-gray-400 text-sm">No stats available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
      {metrics.map((metric) => (
        <StatsCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
};

export default ModernStatsCards;
