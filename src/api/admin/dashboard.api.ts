// ============================================================
// dashboard.api.ts
// Aggregated API functions for the Admin Analytics Dashboard
// Uses only existing backend endpoints
// ============================================================

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

const BASE_URL = "http://localhost:5000";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function safeFetch<T>(
  url: string,
  headers: HeadersInit,
): Promise<T | null> {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ─── Individual Fetchers ──────────────────────────────────────────────────────

async function fetchUsersCount(headers: HeadersInit): Promise<number> {
  type UsersResponse = { data: { users: unknown[] } };
  const data = await safeFetch<UsersResponse>(
    `${BASE_URL}/api/users/users`,
    headers,
  );
  return Array.isArray(data?.data?.users) ? data!.data.users.length : 0;
}

async function fetchProjectsRaw(headers: HeadersInit): Promise<ProjectItem[]> {
  type ProjectsResponse = { data: { projects: ProjectItem[] } };
  const data = await safeFetch<ProjectsResponse>(
    `${BASE_URL}/api/projects`,
    headers,
  );
  return Array.isArray(data?.data?.projects) ? data!.data.projects : [];
}

async function fetchResourcesCount(headers: HeadersInit): Promise<number> {
  type ResourcesResponse = { data: { resources: unknown[] } };
  const data = await safeFetch<ResourcesResponse>(
    `${BASE_URL}/api/resources`,
    headers,
  );
  return Array.isArray(data?.data?.resources) ? data!.data.resources.length : 0;
}

async function fetchBlogsCount(headers: HeadersInit): Promise<number> {
  type BlogsResponse = { data: { blogs: unknown[] } };
  const data = await safeFetch<BlogsResponse>(`${BASE_URL}/api/blogs`, headers);
  return Array.isArray(data?.data?.blogs) ? data!.data.blogs.length : 0;
}

async function fetchInquiriesCount(headers: HeadersInit): Promise<number> {
  type InquiriesResponse = { data: { inquiries: unknown[] } };
  const data = await safeFetch<InquiriesResponse>(
    `${BASE_URL}/api/admin/hire-inquiries`,
    headers,
  );
  return Array.isArray(data?.data?.inquiries) ? data!.data.inquiries.length : 0;
}

async function fetchTasksRaw(headers: HeadersInit): Promise<Task[]> {
  const data = await safeFetch<Task[]>(`${BASE_URL}/tasks`, headers);
  return Array.isArray(data) ? data : [];
}

async function fetchEventsRaw(headers: HeadersInit): Promise<EventItem[]> {
  type EventsResponse = { data: { events: EventItem[] } } | EventItem[];
  const data = await safeFetch<EventsResponse>(
    `${BASE_URL}/api/events`,
    headers,
  );
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: { events: EventItem[] } }).data?.events)
  ) {
    return (data as { data: { events: EventItem[] } }).data.events;
  }
  return [];
}

// ─── Aggregated Exports ───────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const headers = getAuthHeaders();

  const [users, projects, resources, blogs, inquiries, tasks, events] =
    await Promise.all([
      fetchUsersCount(headers),
      fetchProjectsRaw(headers).then((p) => p.length),
      fetchResourcesCount(headers),
      fetchBlogsCount(headers),
      fetchInquiriesCount(headers),
      fetchTasksRaw(headers).then((t) => t.length),
      fetchEventsRaw(headers).then((e) => e.length),
    ]);

  return { users, projects, resources, blogs, inquiries, tasks, events };
}

export async function getTaskAnalytics(): Promise<TaskAnalytics> {
  const headers = getAuthHeaders();
  const tasks = await fetchTasksRaw(headers);

  const now = new Date();

  const byStatus: Record<string, number> = {
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
    cancelled: 0,
  };

  let overdue = 0;

  for (const task of tasks) {
    const status = task.status?.toLowerCase() ?? "pending";
    const key = status.replace(" ", "_");
    if (key in byStatus) {
      byStatus[key]++;
    } else {
      byStatus["pending"]++;
    }

    if (
      task.dueDate &&
      new Date(task.dueDate) < now &&
      task.status !== "completed" &&
      task.status !== "cancelled"
    ) {
      overdue++;
    }
  }

  const completed = byStatus["completed"] ?? 0;
  const completionRate =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return {
    total: tasks.length,
    byStatus: byStatus as TaskAnalytics["byStatus"],
    overdue,
    completionRate,
    recentTasks,
  };
}

export async function getEventInsights(): Promise<EventInsightsData> {
  const headers = getAuthHeaders();
  const events = await fetchEventsRaw(headers);

  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const totalAttendees = events.reduce((sum, e) => sum + (e.attendees ?? 0), 0);
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
  const headers = getAuthHeaders();
  const projects = await fetchProjectsRaw(headers);

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

  // Growth: compare last 30 days vs prior 30 days
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

  return {
    total: projects.length,
    recentProjects,
    byStatus,
    growthPercent,
  };
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  const headers = getAuthHeaders();

  const [projects, tasks, events] = await Promise.all([
    fetchProjectsRaw(headers),
    fetchTasksRaw(headers),
    fetchEventsRaw(headers),
  ]);

  const activities: ActivityItem[] = [];

  // Map projects → activities
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

  // Map tasks → activities
  for (const task of tasks.slice(0, 3)) {
    const type: ActivityType =
      task.status === "completed" ? "task_completed" : "task_assigned";
    activities.push({
      id: `task-${task._id}`,
      type,
      title: type === "task_completed" ? "Task Completed" : "Task Assigned",
      description: task.title,
      timestamp: task.createdAt,
      metadata: { priority: task.priority },
    });
  }

  // Map events → activities
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

  // Sort by most recent first
  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export async function getSystemHealth(): Promise<SystemHealthIndicator[]> {
  const headers = getAuthHeaders();

  const endpoints: Array<{ service: string; url: string }> = [
    { service: "Users API", url: `${BASE_URL}/api/users/users` },
    { service: "Projects API", url: `${BASE_URL}/api/projects` },
    { service: "Resources API", url: `${BASE_URL}/api/resources` },
    { service: "Events API", url: `${BASE_URL}/api/events` },
    { service: "Tasks API", url: `${BASE_URL}/tasks` },
  ];

  const results = await Promise.all(
    endpoints.map(async ({ service, url }) => {
      const start = performance.now();
      let status: SystemHealthIndicator["status"] = "healthy";
      try {
        const res = await fetch(url, { headers });
        const latency = Math.round(performance.now() - start);
        if (!res.ok) status = "degraded";
        return {
          service,
          status,
          latency,
          uptime: 99.9,
          endpoint: url.replace(BASE_URL, ""),
        };
      } catch {
        return {
          service,
          status: "down" as SystemHealthIndicator["status"],
          latency: 0,
          uptime: 0,
          endpoint: url.replace(BASE_URL, ""),
        };
      }
    }),
  );

  return results;
}
