/**
 * EditBlogModal Component
 * Modal for editing existing blogs
 */

import React from "react";
import { BlogForm } from "./BlogForm";
import type { Blog } from "../../types/blog.types";

interface EditBlogModalProps {
  isOpen: boolean;
  blog: Blog | null;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export const EditBlogModal: React.FC<EditBlogModalProps> = ({
  isOpen,
  blog,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  if (!isOpen || !blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="dialog-panel relative bg-white rounded-2xl shadow-2xl max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-mist-300 px-4 sm:px-8 py-5 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-bold text-navy-800 min-w-0 break-words">
            Edit Blog
          </h2>
          <button
            onClick={onClose}
            className="text-mist-400 hover:text-mist-600 transition-colors"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 px-4 sm:px-8 py-5 sm:py-6 overflow-y-auto">
          <BlogForm
            initialData={blog}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
