// src/hooks/useResources.ts

import { useState, useCallback } from "react";
import React from "react";
import type {
  Resource,
  UserInteraction,
  PaginatedResourcesResponse,
  SingleResourceResponse,
  UpvoteResponse,
  SaveResponse,
  ResourceFilterState,
} from "../types/resource.types";
import {
  getAllResources,
  getResourceById,
  getSavedResources,
  getResourcesByCategory,
  searchResources,
  getResourcesByType,
  upvoteResource,
  saveResource,
} from "../api/member/resource.api";

// ==================== ERROR HELPER ====================

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    if ("response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
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

// ==================== INTERFACE ====================

interface UseResourcesReturn {
  resources: Resource[];
  selectedResource: Resource | null;
  userInteraction: UserInteraction | null;
  savedResources: Resource[];
  loading: boolean;
  error: string | null;
  filters: ResourceFilterState;
  fetchResources: () => Promise<void>;
  fetchResourceById: (id: string) => Promise<void>;
  fetchSavedResources: () => Promise<void>;
  filterByCategory: (category: string) => Promise<void>;
  filterByType: (type: string) => Promise<void>;
  search: (query: string) => Promise<void>;
  upvote: (id: string) => Promise<void>;
  save: (id: string) => Promise<void>;
  clearSelectedResource: () => void;
  setFilters: React.Dispatch<React.SetStateAction<ResourceFilterState>>;
}

// ==================== HOOK ====================

export const useResources = (): UseResourcesReturn => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [userInteraction, setUserInteraction] =
    useState<UserInteraction | null>(null);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResourceFilterState>({
    search: "",
    category: "",
    type: "",
  });

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllResources();
      const data = response.data as PaginatedResourcesResponse;
      setResources(data.data?.resources || []);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResourceById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getResourceById(id);
      const data = response.data as SingleResourceResponse;
      setSelectedResource(data.data?.resource || null);
      setUserInteraction(data.data?.userInteraction || null);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error fetching resource:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedResources = useCallback(async () => {
    try {
      const response = await getSavedResources();
      const data = response.data as PaginatedResourcesResponse;
      setSavedResources(data.data?.resources || []);
    } catch (err) {
      console.error("Error fetching saved resources:", err);
    }
  }, []);

  const filterByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getResourcesByCategory(category);
      const data = response.data as PaginatedResourcesResponse;
      setResources(data.data?.resources || []);
      setFilters((prev) => ({ ...prev, category }));
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error filtering by category:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByType = useCallback(async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getResourcesByType(type);
      const data = response.data as PaginatedResourcesResponse;
      setResources(data.data?.resources || []);
      setFilters((prev) => ({ ...prev, type }));
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error filtering by type:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchResources(query);
      const data = response.data as PaginatedResourcesResponse;
      setResources(data.data?.resources || []);
      setFilters((prev) => ({ ...prev, search: query }));
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error searching resources:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const upvote = useCallback(async (id: string) => {
    try {
      const response = await upvoteResource(id);
      const data = response.data as UpvoteResponse;
      const { hasUpvoted, upvotes } = data.data;
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes } : r)),
      );
      setSelectedResource((prev) =>
        prev && prev.id === id ? { ...prev, upvotes } : prev,
      );
      setUserInteraction((prev) =>
        prev ? { ...prev, hasUpvoted } : { hasUpvoted, hasSaved: false },
      );
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error upvoting resource:", err);
    }
  }, []);

  const save = useCallback(async (id: string) => {
    try {
      const response = await saveResource(id);
      const data = response.data as SaveResponse;
      const { hasSaved } = data.data;
      setUserInteraction((prev) =>
        prev ? { ...prev, hasSaved } : { hasUpvoted: false, hasSaved },
      );
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error saving resource:", err);
    }
  }, []);

  const clearSelectedResource = useCallback(() => {
    setSelectedResource(null);
    setUserInteraction(null);
  }, []);

  return {
    resources,
    selectedResource,
    userInteraction,
    savedResources,
    loading,
    error,
    filters,
    fetchResources,
    fetchResourceById,
    fetchSavedResources,
    filterByCategory,
    filterByType,
    search,
    upvote,
    save,
    clearSelectedResource,
    setFilters,
  };
};
