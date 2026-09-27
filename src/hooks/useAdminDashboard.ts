// ============================================================
// useAdminDashboard.ts
// Custom hook: fetches, caches, and exposes all dashboard data
// ============================================================

import { useEffect, useState, useCallback, useRef } from "react";
import {
  getDashboardStats,
  getTaskAnalytics,
} from "../api/admin/dashboard.api";
import type {
  DashboardStats,
  TaskAnalytics,
  GrowthMetric,
} from "../types/dashboard.types";

// ─── Simple in-memory cache ───────────────────────────────────────────────────
const CACHE_TTL_MS = 60_000; // 1 minute

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry<unknown>> = {};

function getCached<T>(key: string): T | null {
  const entry = cache[key] as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    delete cache[key];
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  cache[key] = { data, timestamp: Date.now() };
}

// ─── Growth metric builder ────────────────────────────────────────────────────
// Used to compare each count against a baseline snapshotted into
// localStorage the first time the dashboard loaded in a given browser -
// not a real time-windowed trend (it reset on a cleared cache or a
// different device, and had no relationship to "vs last week/month").
// StatsCard renders these KPI cards with showGrowth={false} now, so
// previousValue/growthPercent/trend are static, honest placeholders
// rather than a number implying a real trend nothing here actually
// tracks.
function buildGrowthMetrics(stats: DashboardStats): GrowthMetric[] {
  const metrics: GrowthMetric[] = [
    { label: "Total Users", value: stats.users, icon: "users", color: "blue" },
    {
      label: "Projects",
      value: stats.projects,
      icon: "folder",
      color: "indigo",
    },
    {
      label: "Resources",
      value: stats.resources,
      icon: "book",
      color: "purple",
    },
    { label: "Blog Posts", value: stats.blogs, icon: "edit", color: "teal" },
    {
      label: "Hire Inquiries",
      value: stats.inquiries,
      icon: "briefcase",
      color: "orange",
    },
    {
      label: "Active Tasks",
      value: stats.tasks,
      icon: "check-square",
      color: "green",
    },
    { label: "Events", value: stats.events, icon: "calendar", color: "red" },
  ].map((m) => ({
    ...m,
    previousValue: m.value,
    growthPercent: 0,
    trend: "neutral" as const,
  }));

  return metrics;
}

// ─── Hook State ───────────────────────────────────────────────────────────────

interface DashboardHookState {
  stats: DashboardStats | null;
  growthMetrics: GrowthMetric[];
  taskAnalytics: TaskAnalytics | null;
  loading: boolean;
  refreshing: boolean;
  errors: Record<string, string>;
  lastUpdated: Date | null;
  refresh: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdminDashboard(): DashboardHookState {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetric[]>([]);
  const [taskAnalytics, setTaskAnalytics] = useState<TaskAnalytics | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isMounted = useRef(true);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!isMounted.current) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const newErrors: Record<string, string> = {};

    // Stats
    const cachedStats = getCached<DashboardStats>("stats");
    let statsData: DashboardStats | null = cachedStats;
    if (!statsData) {
      try {
        statsData = await getDashboardStats();
        setCached("stats", statsData);
      } catch (e) {
        newErrors["stats"] =
          e instanceof Error ? e.message : "Failed to load stats";
      }
    }
    if (isMounted.current && statsData) {
      setStats(statsData);
      setGrowthMetrics(buildGrowthMetrics(statsData));
    }

    // Task analytics
    const cachedTasks = getCached<TaskAnalytics>("tasks");
    let tasksData: TaskAnalytics | null = cachedTasks;
    if (!tasksData) {
      try {
        tasksData = await getTaskAnalytics();
        setCached("tasks", tasksData);
      } catch (e) {
        newErrors["tasks"] =
          e instanceof Error ? e.message : "Failed to load tasks";
      }
    }
    if (isMounted.current && tasksData) setTaskAnalytics(tasksData);

    if (isMounted.current) {
      setErrors(newErrors);
      setLastUpdated(new Date());
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    void loadData(false);
    return () => {
      isMounted.current = false;
    };
  }, [loadData]);

  const refresh = useCallback(() => {
    Object.keys(cache).forEach((k) => delete cache[k]);
    void loadData(true);
  }, [loadData]);

  return {
    stats,
    growthMetrics,
    taskAnalytics,
    loading,
    refreshing,
    errors,
    lastUpdated,
    refresh,
  };
}
