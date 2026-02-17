// ============================================================
// dashboard.api.ts
// Aggregated API functions for the Admin Analytics Dashboard
// Uses existing backend endpoints via existing apiClient
// ============================================================

import apiClient from "../client";
import type {
  DashboardStats,
  TaskAnalytics,
  EventInsightsData,
  ProjectInsightsData,
  ActivityItem,
  SystemHealthIndicator,
  Task,
  EventItem,
  ProjectItem,
  ActivityType,
} from "../../types/dashboard.types";

// ─── Raw Fetchers (reuse existing apiClient) ──────────────────────────────────

async function fetchUsersRaw(): Promise<unknown[]> {
  try {
    const res = await apiClient.get("/api/users/users");
    const data = res.data as { data?: { users?: unknown[] } };
    return Array.isArray(data?.data?.users) ? data.data!.users! : [];
  } catch {
    return [];
  }
}

async function fetchProjectsRaw(): Promise<ProjectItem[]> {
  try {
    const res = await apiClient.get("/api/projects");
    const data = res.data as { data?: { projects?: ProjectItem[] } };
    return Array.isArray(data?.data?.projects) ? data.data!.projects! : [];
  } catch {
    return [];
  }
}

async function fetchResourcesRaw(): Promise<unknown[]> {
  try {
    const res = await apiClient.get("/api/resources");
    const data = res.data as { data?: { resources?: unknown[] } };
    return Array.isArray(data?.data?.resources) ? data.data!.resources! : [];
  } catch {
    return [];
  }
}

async function fetchBlogsRaw(): Promise<unknown[]> {
  try {
    const res = await apiClient.get("/api/blogs");
    const data = res.data as { data?: { blogs?: unknown[] } };
    return Array.isArray(data?.data?.blogs) ? data.data!.blogs! : [];
  } catch {
    return [];
  }
}

async function fetchInquiriesRaw(): Promise<unknown[]> {
  try {
    const res = await apiClient.get("/api/admin/hire-inquiries");
    const data = res.data as { data?: { inquiries?: unknown[] } };
    return Array.isArray(data?.data?.inquiries) ? data.data!.inquiries! : [];
  } catch {
    return [];
  }
}

async function fetchTasksRaw(): Promise<Task[]> {
  try {
    const res = await apiClient.get("/tasks");
    return Array.isArray(res.data) ? (res.data as Task[]) : [];
  } catch {
    return [];
  }
}

async function fetchEventsRaw(): Promise<EventItem[]> {
  try {
    const res = await apiClient.get("/api/events");
    // Handle both response shapes: array or { data: { events: [] } }
    if (Array.isArray(res.data)) return res.data as EventItem[];
    const wrapped = res.data as { data?: { events?: EventItem[] } };
    if (Array.isArray(wrapped?.data?.events)) return wrapped.data!.events!;
    return [];
  } catch {
    return [];
  }
}

// ─── Aggregated Exports ───────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const [users, projects, resources, blogs, inquiries, tasks, events] =
    await Promise.all([
      fetchUsersRaw().then((u) => u.length),
      fetchProjectsRaw().then((p) => p.length),
      fetchResourcesRaw().then((r) => r.length),
      fetchBlogsRaw().then((b) => b.length),
      fetchInquiriesRaw().then((i) => i.length),
      fetchTasksRaw().then((t) => t.length),
      fetchEventsRaw().then((e) => e.length),
    ]);

  return { users, projects, resources, blogs, inquiries, tasks, events };
}

export async function getTaskAnalytics(): Promise<TaskAnalytics> {
  const tasks = await fetchTasksRaw();
  const now = new Date();

  const byStatus = {
    pending: 0,
    "in-progress": 0,
    completed: 0,
  };

  let overdue = 0;

  for (const task of tasks) {
    // task.status from your API: "pending" | "in-progress" | "completed"
    const s = (task.status ?? "pending") as string;
    if (s === "pending") byStatus.pending++;
    else if (s === "in-progress") byStatus["in-progress"]++;
    else if (s === "completed") byStatus.completed++;
    else byStatus.pending++; // safe fallback

    // Overdue: non-completed task past its due date
    if (task.dueDate && new Date(task.dueDate) < now && s !== "completed") {
      overdue++;
    }
  }

  const completionRate =
    tasks.length > 0
      ? Math.round((byStatus.completed / tasks.length) * 100)
      : 0;

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return {
    total: tasks.length,
    byStatus,
    overdue,
    completionRate,
    recentTasks,
  };
}

// Build real monthly task trend from createdAt + status
export async function getTaskTrendData(): Promise<
  { name: string; completed: number; inProgress: number; pending: number }[]
> {
  const tasks = await fetchTasksRaw();

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();

  // Last 6 months including current
  const slots = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      name: MONTHS[d.getMonth()],
      completed: 0,
      inProgress: 0,
      pending: 0,
    };
  });

  for (const task of tasks) {
    const d = new Date(task.createdAt);
    const slot = slots.find(
      (s) => s.year === d.getFullYear() && s.month === d.getMonth(),
    );
    if (!slot) continue;
    const s = (task.status ?? "pending") as string;
    if (s === "completed") slot.completed++;
    else if (s === "in-progress") slot.inProgress++;
    else slot.pending++;
  }

  return slots.map(({ name, completed, inProgress, pending }) => ({
    name,
    completed,
    inProgress,
    pending,
  }));
}

export async function getEventInsights(): Promise<EventInsightsData> {
  const events = await fetchEventsRaw();
  const now = new Date();

  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  // Support both field names: attendeesCount (real API) and attendees (alias)
  const resolveAttendees = (e: EventItem): number =>
    e.attendeesCount ?? e.attendees ?? 0;

  const totalAttendees = events.reduce(
    (sum, e) => sum + resolveAttendees(e),
    0,
  );
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity ?? 0), 0);
  const averageAttendance =
    events.length > 0 ? Math.round(totalAttendees / events.length) : 0;
  const engagementRate =
    totalCapacity > 0 ? Math.round((totalAttendees / totalCapacity) * 100) : 0;

  return {
    total: events.length,
    upcoming,
    totalAttendees,
    averageAttendance,
    engagementRate,
  };
}

export async function getProjectInsights(): Promise<ProjectInsightsData> {
  const projects = await fetchProjectsRaw();

  const byStatus: Record<string, number> = {};
  for (const project of projects) {
    const status = project.status ?? "unknown";
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentCount = projects.filter(
    (p) => new Date(p.createdAt) >= thirtyDaysAgo,
  ).length;
  const priorCount = projects.filter(
    (p) =>
      new Date(p.createdAt) >= sixtyDaysAgo &&
      new Date(p.createdAt) < thirtyDaysAgo,
  ).length;

  const growthPercent =
    priorCount > 0
      ? Math.round(((recentCount - priorCount) / priorCount) * 100)
      : recentCount > 0
        ? 100
        : 0;

  return { total: projects.length, recentProjects, byStatus, growthPercent };
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  const [projects, tasks, events] = await Promise.all([
    fetchProjectsRaw(),
    fetchTasksRaw(),
    fetchEventsRaw(),
  ]);

  const activities: ActivityItem[] = [];

  for (const project of projects.slice(0, 3)) {
    activities.push({
      id: `project-${project._id}`,
      type: "project_created" as ActivityType,
      title: "Project Created",
      description: project.title,
      timestamp: project.createdAt,
      metadata: { id: project._id },
    });
  }

  for (const task of tasks.slice(0, 3)) {
    const s = (task.status ?? "pending") as string;
    const type: ActivityType =
      s === "completed" ? "task_completed" : "task_assigned";
    activities.push({
      id: `task-${task._id}`,
      type,
      title: s === "completed" ? "Task Completed" : "Task Assigned",
      description: task.title,
      timestamp: task.createdAt,
      metadata: { priority: task.priority },
    });
  }

  for (const event of events.slice(0, 3)) {
    activities.push({
      id: `event-${event._id}`,
      type: "event_created" as ActivityType,
      title: "Event Created",
      description: event.title,
      timestamp: event.createdAt,
      metadata: {},
    });
  }

  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export async function getSystemHealth(): Promise<SystemHealthIndicator[]> {
  const endpoints: { service: string; path: string }[] = [
    { service: "Users API", path: "/api/users/users" },
    { service: "Projects API", path: "/api/projects" },
    { service: "Resources API", path: "/api/resources" },
    { service: "Events API", path: "/api/events" },
    { service: "Tasks API", path: "/tasks" },
  ];

  const results = await Promise.all(
    endpoints.map(async ({ service, path }) => {
      const start = performance.now();
      try {
        const res = await apiClient.get(path);
        const latency = Math.round(performance.now() - start);
        const status: SystemHealthIndicator["status"] =
          res.status >= 200 && res.status < 300 ? "healthy" : "degraded";
        return { service, status, latency, uptime: 99.9, endpoint: path };
      } catch {
        return {
          service,
          status: "down" as SystemHealthIndicator["status"],
          latency: 0,
          uptime: 0,
          endpoint: path,
        };
      }
    }),
  );

  return results;
}
