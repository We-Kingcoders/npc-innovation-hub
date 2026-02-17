// ============================================================
// dashboard.types.ts
// Typed interfaces for the Admin Analytics Dashboard
// ============================================================

export interface DashboardStats {
  users: number;
  projects: number;
  resources: number;
  blogs: number;
  inquiries: number;
  tasks: number;
  events: number;
}

export interface GrowthMetric {
  label: string;
  value: number;
  previousValue: number;
  growthPercent: number;
  trend: "up" | "down" | "neutral";
  unit?: string;
  icon?: string;
  color: "blue" | "green" | "purple" | "orange" | "red" | "indigo" | "teal";
}

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "overdue"
  | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskAnalytics {
  total: number;
  byStatus: Record<TaskStatus, number>;
  overdue: number;
  completionRate: number;
  recentTasks: Task[];
}

export interface EventItem {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  capacity?: number;
  attendees?: number;
  status?: string;
  createdAt: string;
}

export interface EventInsightsData {
  total: number;
  upcoming: EventItem[];
  totalAttendees: number;
  averageAttendance: number;
  engagementRate: number;
}

export interface ProjectItem {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  members?: string[];
  tags?: string[];
}

export interface ProjectInsightsData {
  total: number;
  recentProjects: ProjectItem[];
  byStatus: Record<string, number>;
  growthPercent: number;
}

export type ActivityType =
  | "project_created"
  | "task_assigned"
  | "task_completed"
  | "event_created"
  | "resource_added"
  | "blog_published"
  | "hire_inquiry"
  | "user_joined"
  | "member_updated";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface SystemHealthIndicator {
  service: string;
  status: "healthy" | "degraded" | "down";
  latency: number;
  uptime: number;
  endpoint: string;
}

export interface DashboardData {
  stats: DashboardStats;
  growthMetrics: GrowthMetric[];
  taskAnalytics: TaskAnalytics;
  eventInsights: EventInsightsData;
  projectInsights: ProjectInsightsData;
  recentActivity: ActivityItem[];
  systemHealth: SystemHealthIndicator[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Recharts-compatible data shapes
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesPoint {
  date: string;
  label: string;
  value: number;
  secondary?: number;
}
