/**
 * Resource API Service (Admin)
 *
 * All API calls for resource management
 */

import apiClient from "../client";
import { RESOURCE_ROUTES } from "../routes";
import type {
  PaginatedResourcesResponse,
  SingleResourceResponse,
  ResourceApiResponse,
  CreateResourcePayload,
  UpdateResourcePayload,
  ResourceQueryParams,
} from "../../types/resource.types";

// ==================== GET ALL RESOURCES ====================

export const getAllResources = async (
  params?: ResourceQueryParams,
): Promise<PaginatedResourcesResponse> => {
  const response = await apiClient.get<PaginatedResourcesResponse>(
    RESOURCE_ROUTES.GET_ALL_RESOURCES,
    { params },
  );
  return response.data;
};

// ==================== GET RESOURCE BY ID ====================

export const getResourceById = async (
  id: string,
): Promise<SingleResourceResponse> => {
  const response = await apiClient.get<SingleResourceResponse>(
    RESOURCE_ROUTES.GET_RESOURCE_BY_ID(id),
  );
  return response.data;
};

// ==================== CREATE RESOURCE ====================

export const createResource = async (
  payload: CreateResourcePayload,
): Promise<ResourceApiResponse> => {
  const response = await apiClient.post<ResourceApiResponse>(
    RESOURCE_ROUTES.CREATE_RESOURCE,
    payload,
  );
  return response.data;
};

// ==================== UPDATE RESOURCE (PUT) ====================

export const updateResource = async (
  id: string,
  payload: UpdateResourcePayload,
): Promise<ResourceApiResponse> => {
  const response = await apiClient.put<ResourceApiResponse>(
    RESOURCE_ROUTES.UPDATE_RESOURCE(id),
    payload,
  );
  return response.data;
};

// ==================== PATCH RESOURCE ====================

export const patchResource = async (
  id: string,
  payload: Partial<UpdateResourcePayload>,
): Promise<ResourceApiResponse> => {
  const response = await apiClient.patch<ResourceApiResponse>(
    RESOURCE_ROUTES.UPDATE_RESOURCE(id),
    payload,
  );
  return response.data;
};

// ==================== DELETE RESOURCE ====================

export const deleteResource = async (id: string): Promise<void> => {
  await apiClient.delete(RESOURCE_ROUTES.DELETE_RESOURCE(id));
};

// ==================== GET RESOURCES BY CATEGORY ====================

export const getResourcesByCategory = async (
  category: string,
  params?: ResourceQueryParams,
): Promise<PaginatedResourcesResponse> => {
  const response = await apiClient.get<PaginatedResourcesResponse>(
    RESOURCE_ROUTES.GET_RESOURCES_BY_CATEGORY(category),
    { params },
  );
  return response.data;
};
