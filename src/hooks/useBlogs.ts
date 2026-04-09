// /**
//  * useBlogs Hook
//  * Custom hook for blog management with state and API integration
//  */

// import { useState, useCallback } from "react";
// import type { Blog } from "../types/blog.types";
// import {
//   getAllBlogs,
//   getBlogById,
//   createBlog,
//   updateBlog,
//   deleteBlog,
//   togglePublishBlog,
// } from "../api/admin/blog.api";

// // Error extraction helper
// const extractErrorMessage = (error: unknown): string => {
//   if (error && typeof error === "object") {
//     if ("response" in error) {
//       const axiosError = error as {
//         response?: {
//           data?: { message?: string; error?: string };
//         };
//       };
//       return (
//         axiosError.response?.data?.message ||
//         axiosError.response?.data?.error ||
//         "An error occurred"
//       );
//     }
//     if ("message" in error) {
//       return (error as { message: string }).message;
//     }
//   }
//   return "An unexpected error occurred";
// };

// interface UseBlogsReturn {
//   blogs: Blog[];
//   loading: boolean;
//   error: string | null;
//   fetchBlogs: () => Promise<void>;
//   fetchBlogById: (id: string) => Promise<Blog | null>;
//   handleCreateBlog: (
//     data: Record<string, unknown>,
//     image?: File | null,
//   ) => Promise<boolean>;
//   handleUpdateBlog: (
//     id: string,
//     data: Record<string, unknown>,
//     image?: File | null,
//   ) => Promise<boolean>;
//   handleDeleteBlog: (id: string) => Promise<boolean>;
//   handleTogglePublish: (id: string) => Promise<boolean>;
// }

// export const useBlogs = (): UseBlogsReturn => {
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchBlogs = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getAllBlogs();
//       setBlogs(response.data.blogs || []);
//     } catch (err) {
//       const message = extractErrorMessage(err);
//       setError(message);
//       console.error("Error fetching blogs:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchBlogById = useCallback(
//     async (id: string): Promise<Blog | null> => {
//       try {
//         const response = await getBlogById(id);
//         return response.data.blog || null;
//       } catch (err) {
//         console.error("Error fetching blog:", err);
//         return null;
//       }
//     },
//     [],
//   );

//   const handleCreateBlog = useCallback(
//     async (
//       data: Record<string, unknown>,
//       image?: File | null,
//     ): Promise<boolean> => {
//       setLoading(true);
//       setError(null);
//       try {
//         console.log("Creating blog with data:", data);
//         if (image) {
//           console.log("Image file:", image.name, image.size, image.type);
//         }

//         await createBlog(
//           {
//             title: data.title as string,
//             content: data.content as string,
//             summary: data.summary as string,
//             category: data.category as string,
//             isPublished: data.isPublished as boolean,
//           },
//           image,
//         );
//         await fetchBlogs(); // Refresh list
//         return true;
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);
//         console.error("Error creating blog:", err);
//         console.error("Error details:", JSON.stringify(err, null, 2));
//         return false;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchBlogs],
//   );

//   const handleUpdateBlog = useCallback(
//     async (
//       id: string,
//       data: Record<string, unknown>,
//       image?: File | null,
//     ): Promise<boolean> => {
//       setLoading(true);
//       setError(null);
//       try {
//         await updateBlog(id, data, image);
//         await fetchBlogs(); // Refresh list
//         return true;
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);
//         console.error("Error updating blog:", err);
//         return false;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchBlogs],
//   );

//   const handleDeleteBlog = useCallback(
//     async (id: string): Promise<boolean> => {
//       setLoading(true);
//       setError(null);
//       try {
//         await deleteBlog(id);
//         // Optimistic update
//         setBlogs((prev) => prev.filter((blog) => blog.id !== id));
//         return true;
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);
//         console.error("Error deleting blog:", err);
//         await fetchBlogs(); // Revert on error
//         return false;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchBlogs],
//   );

//   const handleTogglePublish = useCallback(
//     async (id: string): Promise<boolean> => {
//       setLoading(true);
//       setError(null);
//       try {
//         await togglePublishBlog(id);
//         // Optimistic update
//         setBlogs((prev) =>
//           prev.map((blog) =>
//             blog.id === id ? { ...blog, isPublished: !blog.isPublished } : blog,
//           ),
//         );
//         return true;
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);
//         console.error("Error toggling publish:", err);
//         await fetchBlogs(); // Revert on error
//         return false;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchBlogs],
//   );

//   return {
//     blogs,
//     loading,
//     error,
//     fetchBlogs,
//     fetchBlogById,
//     handleCreateBlog,
//     handleUpdateBlog,
//     handleDeleteBlog,
//     handleTogglePublish,
//   };
// };

// src/hooks/useBlogs.ts
/**
 * useBlogs Hook
 * Shared hook for both admin and member blog functionality
 */

import { useState, useCallback } from "react";
import type { Blog } from "../types/blog.types";
import {
  getAllBlogs as adminGetAll,
  getBlogById as adminGetById,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublishBlog,
} from "../api/admin/blog.api";
import {
  getPublishedBlogs,
  getBlogByIdPublic,
  getFeaturedBlogs,
  getBlogsByCategory,
} from "../api/member/blog.api";

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

// ==================== RESPONSE SHAPES ====================

interface BlogListResponse {
  status: string;
  results?: number;
  data: { blogs: Blog[] };
}

interface BlogSingleResponse {
  status: string;
  data: { blog: Blog };
}

// ==================== RETURN TYPE ====================

interface UseBlogsReturn {
  // State
  blogs: Blog[];
  featuredBlogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;

  // Member-side reads (public)
  fetchPublishedBlogs: () => Promise<void>;
  fetchFeaturedBlogs: () => Promise<void>;
  fetchPublicBlogById: (id: string) => Promise<void>;
  fetchBlogsByCategory: (category: string) => Promise<void>;

  // Admin-side reads
  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<Blog | null>;

  // Admin-side writes
  handleCreateBlog: (
    data: Record<string, unknown>,
    image?: File | null,
  ) => Promise<boolean>;
  handleUpdateBlog: (
    id: string,
    data: Record<string, unknown>,
    image?: File | null,
  ) => Promise<boolean>;
  handleDeleteBlog: (id: string) => Promise<boolean>;
  handleTogglePublish: (id: string) => Promise<boolean>;

  clearSelectedBlog: () => void;
}

// ==================== HOOK ====================

export const useBlogs = (): UseBlogsReturn => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Member: fetch all published ──
  const fetchPublishedBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPublishedBlogs();
      const data = response.data as BlogListResponse;
      setBlogs(data.data?.blogs || []);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error fetching published blogs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Member: fetch featured ──
  const fetchFeaturedBlogs = useCallback(async () => {
    try {
      const response = await getFeaturedBlogs();
      const data = response.data as BlogListResponse;
      setFeaturedBlogs(data.data?.blogs || []);
    } catch (err) {
      console.error("Error fetching featured blogs:", err);
    }
  }, []);

  // ── Member: fetch single blog (increments viewCount) ──
  const fetchPublicBlogById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogByIdPublic(id);
      const data = response.data as BlogSingleResponse;
      setSelectedBlog(data.data?.blog || null);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Member: fetch by category ──
  const fetchBlogsByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogsByCategory(category);
      const data = response.data as BlogListResponse;
      setBlogs(data.data?.blogs || []);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error fetching blogs by category:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Admin: fetch all (published + unpublished) ──
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminGetAll();
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError(extractErrorMessage(err));
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Admin: fetch single by id ──
  const fetchBlogById = useCallback(
    async (id: string): Promise<Blog | null> => {
      try {
        const response = await adminGetById(id);
        return response.data.blog || null;
      } catch (err) {
        console.error("Error fetching blog:", err);
        return null;
      }
    },
    [],
  );

  // ── Admin: create ──
  const handleCreateBlog = useCallback(
    async (
      data: Record<string, unknown>,
      image?: File | null,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await createBlog(
          {
            title: data.title as string,
            content: data.content as string,
            summary: data.summary as string,
            category: data.category as string,
            isPublished: data.isPublished as boolean,
          },
          image,
        );
        await fetchBlogs();
        return true;
      } catch (err) {
        setError(extractErrorMessage(err));
        console.error("Error creating blog:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchBlogs],
  );

  // ── Admin: update ──
  const handleUpdateBlog = useCallback(
    async (
      id: string,
      data: Record<string, unknown>,
      image?: File | null,
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await updateBlog(id, data, image);
        await fetchBlogs();
        return true;
      } catch (err) {
        setError(extractErrorMessage(err));
        console.error("Error updating blog:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchBlogs],
  );

  // ── Admin: delete ──
  const handleDeleteBlog = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await deleteBlog(id);
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        return true;
      } catch (err) {
        setError(extractErrorMessage(err));
        console.error("Error deleting blog:", err);
        await fetchBlogs();
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchBlogs],
  );

  // ── Admin: toggle publish ──
  const handleTogglePublish = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await togglePublishBlog(id);
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, isPublished: !b.isPublished } : b,
          ),
        );
        return true;
      } catch (err) {
        setError(extractErrorMessage(err));
        console.error("Error toggling publish:", err);
        await fetchBlogs();
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchBlogs],
  );

  const clearSelectedBlog = useCallback(() => setSelectedBlog(null), []);

  return {
    blogs,
    featuredBlogs,
    selectedBlog,
    loading,
    error,
    fetchPublishedBlogs,
    fetchFeaturedBlogs,
    fetchPublicBlogById,
    fetchBlogsByCategory,
    fetchBlogs,
    fetchBlogById,
    handleCreateBlog,
    handleUpdateBlog,
    handleDeleteBlog,
    handleTogglePublish,
    clearSelectedBlog,
  };
};
