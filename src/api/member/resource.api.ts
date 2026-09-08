// src/api/member/resource.api.ts

import client from "../client";

// The backend paginates all of these (default limit: 12). The member
// Resources page fetches once and does its own client-side search/filter
// over the result (see the comment in Resources.tsx), the saved-ids Set
// used for the bookmark icon needs every saved resource (not just the first
// page), and a category/type/search results view is expected to show
// everything that matches - so all of them ask for a high limit here to
// make that actually true instead of silently capping at 12 results.
const FETCH_ALL_LIMIT = 1000;

export const getAllResources = () =>
  client.get("/api/resources", { params: { limit: FETCH_ALL_LIMIT } });

export const getResourceById = (id: string) =>
  client.get(`/api/resources/resource/${id}`);

export const getSavedResources = () =>
  client.get("/api/resources/saved", { params: { limit: FETCH_ALL_LIMIT } });

export const upvoteResource = (id: string) =>
  client.post(`/api/resources/resource/${id}/upvote`);

export const saveResource = (id: string) =>
  client.post(`/api/resources/resource/${id}/save`);

export const searchResources = (query: string) =>
  client.get("/api/resources/search", {
    params: { q: query, limit: FETCH_ALL_LIMIT },
  });

export const getResourcesByCategory = (category: string) =>
  client.get(`/api/resources/category/${category}`, {
    params: { limit: FETCH_ALL_LIMIT },
  });

export const getResourcesByType = (type: string) =>
  client.get(`/api/resources/type/${type}`, {
    params: { limit: FETCH_ALL_LIMIT },
  });

export const getVideoResources = () => client.get("/api/resources/videos");
