/**
 * Project API Service
 * Handles all project-related API calls
 */

import apiClient from "../client";
import type {
  ProjectsResponse,
  ProjectResponse,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "../../types/project.types";

const PROJECT_ROUTES = {
  GET_ALL_PROJECTS: "/api/projects",
  GET_PROJECT_BY_ID: (id: string) => `/api/projects/project/${id}`,
  CREATE_PROJECT: "/api/projects",
  UPDATE_PROJECT: (id: string) => `/api/projects/${id}`,
  DELETE_PROJECT: (id: string) => `/api/projects/${id}`,
  GET_MY_PROJECTS: "/api/projects/me",
  SEARCH_PROJECTS: "/api/projects/search",
};

/**
 * Get all projects
 */
export const getProjects = async (): Promise<ProjectsResponse> => {
  const response = await apiClient.get(PROJECT_ROUTES.GET_ALL_PROJECTS);
  return response.data as ProjectsResponse;
};

/**
 * Get project by ID
 */
export const getProject = async (id: string): Promise<ProjectResponse> => {
  const response = await apiClient.get(PROJECT_ROUTES.GET_PROJECT_BY_ID(id));
  return response.data as ProjectResponse;
};

/**
 * Create new project
 */
export const createProject = async (
  payload: CreateProjectPayload,
): Promise<ProjectResponse> => {
  const response = await apiClient.post(PROJECT_ROUTES.CREATE_PROJECT, payload);
  return response.data as ProjectResponse;
};

/**
 * Update existing project
 */
export const updateProject = async (
  id: string,
  payload: UpdateProjectPayload,
): Promise<ProjectResponse> => {
  const response = await apiClient.patch(
    PROJECT_ROUTES.UPDATE_PROJECT(id),
    payload,
  );
  return response.data as ProjectResponse;
};

/**
 * Delete project
 */
export const deleteProject = async (
  id: string,
): Promise<{ status: string; message: string }> => {
  const response = await apiClient.delete(PROJECT_ROUTES.DELETE_PROJECT(id));
  return response.data as { status: string; message: string };
};
