/**
 * Task Type Definitions
 * TypeScript interfaces for task management
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "Member";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  githubIssueLink: string;
  dueDate: string; // ISO date string
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  assignee: User;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  githubIssueLink: string;
  assignedTo: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  githubIssueLink?: string;
  assignedTo?: string;
}

export interface AssignTaskPayload {
  userId: string;
  githubIssueLink?: string;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskResponse {
  task: Task;
}

export type TaskStatus = "pending" | "in-progress" | "completed" | "all";
export type TaskPriority = "low" | "medium" | "high" | "all";

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "all", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
};

// Helper function to get priority color
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Helper function to check if task is overdue
export const isTaskOverdue = (dueDate: string, status: string): boolean => {
  if (status === "completed") return false;
  return new Date(dueDate) < new Date();
};

// Helper function to get days until due
export const getDaysUntilDue = (dueDate: string): string => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else {
    return `${diffDays} days left`;
  }
};

// Helper function to format user name
export const getUserFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

// Helper function to get user initials
export const getUserInitials = (user: User): string => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};
