/**
 * useAdminResources Hook
 *
 * Manages resource data fetching, mutations, and state
 */

import { useState, useCallback } from "react";
import {
  getAllResources,
  getResourceById,
  createResource as createResourceApi,
  updateResource as updateResourceApi,
  deleteResource as deleteResourceApi,
} from "../api/admin/resource.api";
import type {
  Resource,
  CreateResourcePayload,
  UpdateResourcePayload,
  ResourceQueryParams,
  PaginationState,
} from "../types/resource.types";

// ==================== HOOK STATE ====================

interface UseAdminResourcesState {
  resources: Resource[];
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  fetchResources: (params?: ResourceQueryParams) => Promise<void>;
  fetchResourceById: (id: string) => Promise<Resource | null>;
  createResource: (payload: CreateResourcePayload) => Promise<boolean>;
  updateResource: (
    id: string,
    payload: UpdateResourcePayload,
  ) => Promise<boolean>;
  deleteResource: (id: string) => Promise<boolean>;
  clearError: () => void;
}

// ==================== HOOK ====================

export const useAdminResources = (): UseAdminResourcesState => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== FETCH ALL RESOURCES ====================

  const fetchResources = useCallback(async (params?: ResourceQueryParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllResources(params);

      setResources(response.data.resources);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        itemsPerPage: params?.limit || 12,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch resources";
      setError(errorMessage);
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FETCH RESOURCE BY ID ====================

  const fetchResourceById = useCallback(
    async (id: string): Promise<Resource | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await getResourceById(id);
        return response.data.resource;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch resource";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== CREATE RESOURCE ====================

  const createResource = useCallback(
    async (payload: CreateResourcePayload): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await createResourceApi(payload);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create resource";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== UPDATE RESOURCE ====================

  const updateResource = useCallback(
    async (id: string, payload: UpdateResourcePayload): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await updateResourceApi(id, payload);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update resource";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== DELETE RESOURCE ====================

  const deleteResource = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteResourceApi(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete resource";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== CLEAR ERROR ====================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    resources,
    pagination,
    loading,
    error,
    fetchResources,
    fetchResourceById,
    createResource,
    updateResource,
    deleteResource,
    clearError,
  };
};
