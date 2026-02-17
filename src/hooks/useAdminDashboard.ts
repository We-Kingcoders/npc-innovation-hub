// ============================================================
// useAdminDashboard.ts
// Custom hook: fetches, caches, and exposes all dashboard data
// ============================================================

import { useEffect, useState, useCallback, useRef } from "react";
import {
  getDashboardStats,
  getTaskAnalytics,
  getEventInsights,
  getProjectInsights,
  getRecentActivity,
  getSystemHealth,
} from "../api/admin/dashboard.api";
import type {
  DashboardStats,
  TaskAnalytics,
  EventInsightsData,
  ProjectInsightsData,
  ActivityItem,
  SystemHealthIndicator,
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
function buildGrowthMetrics(stats: DashboardStats): GrowthMetric[] {
  // Since we don't have historical data per-call, we simulate
  // growth by comparing to a stored baseline (localStorage fallback)
  const storedRaw = localStorage.getItem("dashboard_baseline");
  let baseline: Partial<DashboardStats> = {};
  try {
    baseline = storedRaw
      ? (JSON.parse(storedRaw) as Partial<DashboardStats>)
      : {};
  } catch {
    baseline = {};
  }

  // Update baseline if not set
  if (!storedRaw) {
    localStorage.setItem("dashboard_baseline", JSON.stringify(stats));
  }

  function growth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  const metrics: GrowthMetric[] = [
    {
      label: "Total Users",
      value: stats.users,
      previousValue: baseline.users ?? stats.users,
      growthPercent: growth(stats.users, baseline.users ?? stats.users),
      trend:
        stats.users > (baseline.users ?? stats.users)
          ? "up"
          : stats.users < (baseline.users ?? stats.users)
            ? "down"
            : "neutral",
      icon: "users",
      color: "blue",
    },
    {
      label: "Projects",
      value: stats.projects,
      previousValue: baseline.projects ?? stats.projects,
      growthPercent: growth(
        stats.projects,
        baseline.projects ?? stats.projects,
      ),
      trend:
        stats.projects > (baseline.projects ?? stats.projects)
          ? "up"
          : "neutral",
      icon: "folder",
      color: "indigo",
    },
    {
      label: "Resources",
      value: stats.resources,
      previousValue: baseline.resources ?? stats.resources,
      growthPercent: growth(
        stats.resources,
        baseline.resources ?? stats.resources,
      ),
      trend:
        stats.resources > (baseline.resources ?? stats.resources)
          ? "up"
          : "neutral",
      icon: "book",
      color: "purple",
    },
    {
      label: "Blog Posts",
      value: stats.blogs,
      previousValue: baseline.blogs ?? stats.blogs,
      growthPercent: growth(stats.blogs, baseline.blogs ?? stats.blogs),
      trend: stats.blogs > (baseline.blogs ?? stats.blogs) ? "up" : "neutral",
      icon: "edit",
      color: "teal",
    },
    {
      label: "Hire Inquiries",
      value: stats.inquiries,
      previousValue: baseline.inquiries ?? stats.inquiries,
      growthPercent: growth(
        stats.inquiries,
        baseline.inquiries ?? stats.inquiries,
      ),
      trend:
        stats.inquiries > (baseline.inquiries ?? stats.inquiries)
          ? "up"
          : "neutral",
      icon: "briefcase",
      color: "orange",
    },
    {
      label: "Active Tasks",
      value: stats.tasks,
      previousValue: baseline.tasks ?? stats.tasks,
      growthPercent: growth(stats.tasks, baseline.tasks ?? stats.tasks),
      trend: stats.tasks > (baseline.tasks ?? stats.tasks) ? "up" : "neutral",
      icon: "check-square",
      color: "green",
    },
    {
      label: "Events",
      value: stats.events,
      previousValue: baseline.events ?? stats.events,
      growthPercent: growth(stats.events, baseline.events ?? stats.events),
      trend:
        stats.events > (baseline.events ?? stats.events) ? "up" : "neutral",
      icon: "calendar",
      color: "red",
    },
  ];

  return metrics;
}

// ─── Hook State ───────────────────────────────────────────────────────────────

interface DashboardHookState {
  stats: DashboardStats | null;
  growthMetrics: GrowthMetric[];
  taskAnalytics: TaskAnalytics | null;
  eventInsights: EventInsightsData | null;
  projectInsights: ProjectInsightsData | null;
  recentActivity: ActivityItem[];
  systemHealth: SystemHealthIndicator[];
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
  const [eventInsights, setEventInsights] = useState<EventInsightsData | null>(
    null,
  );
  const [projectInsights, setProjectInsights] =
    useState<ProjectInsightsData | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthIndicator[]>([]);

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

    // ── Stats ──
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

    // ── Tasks ──
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

    // ── Events ──
    const cachedEvents = getCached<EventInsightsData>("events");
    let eventsData: EventInsightsData | null = cachedEvents;
    if (!eventsData) {
      try {
        eventsData = await getEventInsights();
        setCached("events", eventsData);
      } catch (e) {
        newErrors["events"] =
          e instanceof Error ? e.message : "Failed to load events";
      }
    }
    if (isMounted.current && eventsData) setEventInsights(eventsData);

    // ── Projects ──
    const cachedProjects = getCached<ProjectInsightsData>("projects");
    let projectsData: ProjectInsightsData | null = cachedProjects;
    if (!projectsData) {
      try {
        projectsData = await getProjectInsights();
        setCached("projects", projectsData);
      } catch (e) {
        newErrors["projects"] =
          e instanceof Error ? e.message : "Failed to load projects";
      }
    }
    if (isMounted.current && projectsData) setProjectInsights(projectsData);

    // ── Activity ──
    const cachedActivity = getCached<ActivityItem[]>("activity");
    let activityData: ActivityItem[] | null = cachedActivity;
    if (!activityData) {
      try {
        activityData = await getRecentActivity();
        setCached("activity", activityData);
      } catch (e) {
        newErrors["activity"] =
          e instanceof Error ? e.message : "Failed to load activity";
        activityData = [];
      }
    }
    if (isMounted.current) setRecentActivity(activityData ?? []);

    // ── System Health ──
    const cachedHealth = getCached<SystemHealthIndicator[]>("health");
    let healthData: SystemHealthIndicator[] | null = cachedHealth;
    if (!healthData) {
      try {
        healthData = await getSystemHealth();
        setCached("health", healthData);
      } catch {
        healthData = [];
      }
    }
    if (isMounted.current) setSystemHealth(healthData ?? []);

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
    // Clear cache
    Object.keys(cache).forEach((k) => delete cache[k]);
    void loadData(true);
  }, [loadData]);

  return {
    stats,
    growthMetrics,
    taskAnalytics,
    eventInsights,
    projectInsights,
    recentActivity,
    systemHealth,
    loading,
    refreshing,
    errors,
    lastUpdated,
    refresh,
  };
}
