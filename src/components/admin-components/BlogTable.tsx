/**
 * BlogTable Component
 * Displays blogs in a table with actions
 */

import React, { useState, useRef, useEffect } from "react";
import type { Blog } from "../../types/blog.types";
import { format } from "date-fns";

interface BlogTableProps {
  blogs: Blog[];
  loading: boolean;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

interface ActionMenuState {
  blogId: string | null;
  position: { top: number; right: number };
}

export default function BlogTable({
  blogs,
  loading,
  onEdit,
  onDelete,
  onTogglePublish,
}: BlogTableProps) {
  const [actionMenu, setActionMenu] = useState<ActionMenuState>({
    blogId: null,
    position: { top: 0, right: 0 },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenu({ blogId: null, position: { top: 0, right: 0 } });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleActionMenu = (blogId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    if (actionMenu.blogId === blogId) {
      setActionMenu({ blogId: null, position: { top: 0, right: 0 } });
    } else {
      setActionMenu({
        blogId,
        position: {
          top: rect.bottom + window.scrollY,
          right: window.innerWidth - rect.right,
        },
      });
    }
  };

  const handleAction = (action: () => void) => {
    action();
    setActionMenu({ blogId: null, position: { top: 0, right: 0 } });
  };

  // Filtering logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || blog.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && blog.isPublished) ||
      (statusFilter === "draft" && !blog.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(blogs.map((b) => b.category)));

  if (loading) {
    return (
      <div className="ml-8 p-0">
        <div className="w-full max-w-[98%]">
          {/* Skeleton loader */}
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-2xl" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-8 p-0">
      <div className="w-full max-w-[98%]">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "published" | "draft")
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Table */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600">
              {searchQuery || categoryFilter || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first blog post"}
            </p>
          </div>
        ) : (
          <table className="w-full bg-[#f4f6fa] rounded-t-2xl overflow-hidden">
            <thead>
              <tr className="bg-[#343a5e] text-white text-left">
                <th className="px-6 py-4 rounded-tl-2xl">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 rounded-tr-2xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-900 truncate">
                        {blog.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {blog.summary}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        blog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{blog.viewCount}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={(e) => toggleActionMenu(blog.id, e)}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                    </button>

                    {/* Action Menu */}
                    {actionMenu.blogId === blog.id && (
                      <div
                        ref={menuRef}
                        style={{
                          position: "fixed",
                          top: `${actionMenu.position.top}px`,
                          right: `${actionMenu.position.right}px`,
                        }}
                        className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px] z-50"
                      >
                        <button
                          onClick={() => handleAction(() => onEdit(blog))}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleAction(() => onTogglePublish(blog.id))
                          }
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                          {blog.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleAction(() => onDelete(blog.id))}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
