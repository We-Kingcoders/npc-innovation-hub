/**
 * useProjects Hook
 * Custom hook for project management with state and API integration
 */

import { useState, useCallback } from "react";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "../types/project.types";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../api/admin/project.api";

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

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project | null>;
  handleCreateProject: (payload: CreateProjectPayload) => Promise<boolean>;
  handleUpdateProject: (
    id: string,
    payload: UpdateProjectPayload,
  ) => Promise<boolean>;
  handleDeleteProject: (id: string) => Promise<boolean>;
}

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProjects();
      setProjects(response.data.projects || []);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectById = useCallback(
    async (id: string): Promise<Project | null> => {
      try {
        const response = await getProject(id);
        return response.data.project || null;
      } catch (err) {
        console.error("Error fetching project:", err);
        return null;
      }
    },
    [],
  );

  const handleCreateProject = useCallback(
    async (payload: CreateProjectPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await createProject(payload);
        await fetchProjects(); // Refresh list
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error creating project:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects],
  );

  const handleUpdateProject = useCallback(
    async (id: string, payload: UpdateProjectPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await updateProject(id, payload);
        await fetchProjects(); // Refresh list
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error updating project:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects],
  );

  const handleDeleteProject = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await deleteProject(id);
        // Optimistic update
        setProjects((prev) => prev.filter((project) => project.id !== id));
        return true;
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);
        console.error("Error deleting project:", err);
        await fetchProjects(); // Revert on error
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects],
  );

  return {
    projects,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
  };
};
