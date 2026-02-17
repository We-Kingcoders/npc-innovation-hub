/**
 * Task API Service
 * Handles all task-related API calls
 */

import apiClient from "../client";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  AssignTaskPayload,
} from "../../types/task.types";

const TASK_ROUTES = {
  GET_ALL_TASKS: "/tasks",
  GET_TASK_BY_ID: (id: string) => `/tasks/${id}`,
  CREATE_TASK: "/tasks",
  UPDATE_TASK: (id: string) => `/tasks/${id}`,
  DELETE_TASK: (id: string) => `/tasks/${id}`,
  ASSIGN_TASK: (id: string) => `/tasks/${id}/assign`,
  GET_ASSIGNED_TASKS: "/tasks/assigned",
};

/**
 * Get all tasks
 */
export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get(TASK_ROUTES.GET_ALL_TASKS);
  // API returns array directly
  return response.data as Task[];
};

/**
 * Get task by ID
 */
export const getTask = async (id: string): Promise<Task> => {
  const response = await apiClient.get(TASK_ROUTES.GET_TASK_BY_ID(id));
  return response.data as Task;
};

/**
 * Create new task
 */
export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const response = await apiClient.post(TASK_ROUTES.CREATE_TASK, payload);
  return response.data as Task;
};

/**
 * Update existing task
 */
export const updateTask = async (
  id: string,
  payload: UpdateTaskPayload,
): Promise<Task> => {
  const response = await apiClient.patch(TASK_ROUTES.UPDATE_TASK(id), payload);
  return response.data as Task;
};

/**
 * Delete task
 */
export const deleteTask = async (
  id: string,
): Promise<{ status: string; message: string }> => {
  const response = await apiClient.delete(TASK_ROUTES.DELETE_TASK(id));
  return response.data as { status: string; message: string };
};

/**
 * Assign task to a member
 */
export const assignTask = async (
  id: string,
  payload: AssignTaskPayload,
): Promise<Task> => {
  const response = await apiClient.patch(TASK_ROUTES.ASSIGN_TASK(id), payload);
  return response.data as Task;
};
