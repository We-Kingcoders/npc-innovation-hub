// src/hooks/useMemberProjects.ts
// Member-side ONLY — do NOT import this in admin modules

import { useState, useEffect, useCallback } from "react";
import type { MemberProject } from "../api/member/project.api";
import {
  getAllProjects,
  getMyProjects,
  deleteProject as apiDeleteProject,
  searchProjects as apiSearchProjects,
  updateProject as apiUpdateProject,
} from "../api/member/project.api";

type ViewMode = "all" | "mine";

interface UseMemberProjectsReturn {
  projects: MemberProject[];
  loading: boolean;
  error: string | null;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, payload: FormData) => Promise<void>;
  searchProjects: (query: string) => Promise<void>;
  refresh: () => void;
}

export function useMemberProjects(): UseMemberProjectsReturn {
  const [projects, setProjects] = useState<MemberProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res =
        viewMode === "mine" ? await getMyProjects() : await getAllProjects();
      setProjects(res.data.projects);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load projects";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [viewMode]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async (id: string) => {
    await apiDeleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProject = async (id: string, payload: FormData) => {
    const res = await apiUpdateProject(id, payload);
    const updated = res.data.project;
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const searchProjects = async (query: string) => {
    if (!query.trim()) {
      fetchProjects();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiSearchProjects(query);
      setProjects(res.data.projects);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Search failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    viewMode,
    setViewMode,
    deleteProject,
    updateProject,
    searchProjects,
    refresh: fetchProjects,
  };
}
