// src/api/member/blog.api.ts

import client from "../client";

export const getPublishedBlogs = () => client.get("/api/blogs");

export const getBlogByIdPublic = (id: string) =>
  client.get(`/api/blogs/blog/${id}`);

export const getFeaturedBlogs = () => client.get("/api/blogs/featured");

export const getBlogsByCategory = (category: string) =>
  client.get(`/api/blogs/category/${encodeURIComponent(category)}`);
