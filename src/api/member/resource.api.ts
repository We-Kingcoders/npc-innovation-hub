// src/api/member/resource.api.ts

import client from "../client";

export const getAllResources = () => client.get("/api/resources");

export const getResourceById = (id: string) =>
  client.get(`/api/resources/resource/${id}`);

export const getSavedResources = () => client.get("/api/resources/saved");

export const upvoteResource = (id: string) =>
  client.post(`/api/resources/resource/${id}/upvote`);

export const saveResource = (id: string) =>
  client.post(`/api/resources/resource/${id}/save`);

export const searchResources = (query: string) =>
  client.get("/api/resources/search", { params: { q: query } });

export const getResourcesByCategory = (category: string) =>
  client.get(`/api/resources/category/${category}`);

export const getResourcesByType = (type: string) =>
  client.get(`/api/resources/type/${type}`);

export const getVideoResources = () => client.get("/api/resources/videos");
