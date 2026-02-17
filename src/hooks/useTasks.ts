/**
 * useTasks Hook
 * Custom hook for task management with state and API integration
 */

import { useState, useCallback } from "react";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  AssignTaskPayload,
} from "../types/task.types";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  assignTask,
} from "../api/admin/task.api";

// Error extraction helper
const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    if ("response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string };
        };
      };
      return (
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "An error occurred"
      );
    }
    if ("message" in error) {
      return (error as { message: string }).message;
    }
  }
  return "An unexpected error occurred";
};

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: string) => Promise<Task | null>;
  handleCreateTask: (payload: CreateTaskPayload) => Promise<boolean>;
  handleUpdateTask: (
    id: string,
    payload: UpdateTaskPayload,
  ) => Promise<boolean>;
  handleDeleteTask: (id: string) => Promise<boolean>;
  handleAssignTask: (
    id: string,
    payload: AssignTaskPayload,
  ) => Promise<boolean>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksData = await getTasks();
      setTasks(tasksData || []);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTaskById = useCallback(
    async (id: string): Promise<Task | null> => {
      try {
        const task = await getTask(id);
        return task || null;
      } catch (err) {
        console.error("Error fetching task:", err);
        return null;
      }
    },
    [],
  );

  const handleCreateTask = useCallback(
    async (payload: CreateTaskPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await createTask(payload);
        await fetchTasks(); // Refresh list
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error creating task:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  const handleUpdateTask = useCallback(
    async (id: string, payload: UpdateTaskPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await updateTask(id, payload);
        await fetchTasks(); // Refresh list
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error updating task:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  const handleDeleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await deleteTask(id);
        // Optimistic update
        setTasks((prev) => prev.filter((task) => task.id !== id));
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error deleting task:", err);
        await fetchTasks(); // Revert on error
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  const handleAssignTask = useCallback(
    async (id: string, payload: AssignTaskPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await assignTask(id, payload);
        await fetchTasks(); // Refresh list
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error assigning task:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks],
  );

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAssignTask,
  };
};
