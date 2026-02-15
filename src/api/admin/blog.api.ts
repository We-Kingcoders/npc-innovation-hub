/**
 * Blog API Service
 * Handles all blog-related API calls
 */

import apiClient from "../client";
import { BLOG_ROUTES } from "../routes";
import type {
  BlogApiResponse,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "../../types/blog.types";

/**
 * Get all blogs (published + unpublished) - Admin only
 */
export const getAllBlogs = async (): Promise<BlogApiResponse> => {
  const response = await apiClient.get(BLOG_ROUTES.GET_ALL_ADMIN_BLOGS);
  return response.data as BlogApiResponse;
};

/**
 * Get blog by ID
 */
export const getBlogById = async (id: string): Promise<BlogApiResponse> => {
  const response = await apiClient.get(BLOG_ROUTES.GET_BLOG_BY_ID(id));
  return response.data as BlogApiResponse;
};

/**
 * Create new blog
 * Supports multipart/form-data if image is included
 */
export const createBlog = async (
  data: CreateBlogPayload,
  image?: File | null,
): Promise<BlogApiResponse> => {
  let payload: FormData | CreateBlogPayload;
  let headers = {};

  if (image) {
    // Use FormData for image upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("summary", data.summary);
    formData.append("category", data.category);
    formData.append("isPublished", data.isPublished.toString());
    formData.append("image", image);

    payload = formData;
    headers = { "Content-Type": "multipart/form-data" };
  } else {
    // Use JSON for no image
    payload = data;
  }

  const response = await apiClient.post(BLOG_ROUTES.CREATE_BLOG, payload, {
    headers,
  });
  return response.data as BlogApiResponse;
};

/**
 * Update existing blog
 * Supports multipart/form-data if image is included
 */
export const updateBlog = async (
  id: string,
  data: UpdateBlogPayload,
  image?: File | null,
): Promise<BlogApiResponse> => {
  let payload: FormData | UpdateBlogPayload;
  let headers = {};

  if (image) {
    // Use FormData for image upload
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.content) formData.append("content", data.content);
    if (data.summary) formData.append("summary", data.summary);
    if (data.category) formData.append("category", data.category);
    if (data.isPublished !== undefined)
      formData.append("isPublished", data.isPublished.toString());
    formData.append("image", image);

    payload = formData;
    headers = { "Content-Type": "multipart/form-data" };
  } else {
    // Use JSON for no image
    payload = data;
  }

  const response = await apiClient.patch(BLOG_ROUTES.UPDATE_BLOG(id), payload, {
    headers,
  });
  return response.data as BlogApiResponse;
};

/**
 * Delete blog
 */
export const deleteBlog = async (id: string): Promise<BlogApiResponse> => {
  const response = await apiClient.delete(BLOG_ROUTES.DELETE_BLOG(id));
  return response.data as BlogApiResponse;
};

/**
 * Toggle blog publish status
 */
export const togglePublishBlog = async (
  id: string,
): Promise<BlogApiResponse> => {
  const response = await apiClient.patch(BLOG_ROUTES.TOGGLE_PUBLISH_BLOG(id));
  return response.data as BlogApiResponse;
};
