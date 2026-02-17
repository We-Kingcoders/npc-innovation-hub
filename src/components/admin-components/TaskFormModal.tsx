/**
 * TaskFormModal Component
 * Modal for creating and editing tasks
 */

import React from "react";
import { useState, useEffect } from "react";
import type { Task, User } from "../../types/task.types";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  initialData?: Task | null;
  isLoading?: boolean;
  members: User[];
}

interface FormErrors {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  githubIssueLink?: string;
  assignedTo?: string;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  members,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    githubIssueLink: "",
    assignedTo: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      const dueDate = initialData.dueDate
        ? initialData.dueDate.split("T")[0]
        : "";
      setFormData({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        priority: initialData.priority,
        dueDate,
        githubIssueLink: initialData.githubIssueLink,
        assignedTo: initialData.assignedTo,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
        githubIssueLink: "",
        assignedTo: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = "Please assign to a member";
    }

    if (formData.githubIssueLink && !isValidUrl(formData.githubIssueLink)) {
      newErrors.githubIssueLink = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-5 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
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
        <form
          onSubmit={handleSubmit}
          className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-2.5 border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="E.g., Fix login authentication timeout"
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className={`w-full px-4 py-2.5 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                placeholder="Describe the task in detail..."
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Status & Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className={`w-full px-4 py-2.5 border ${
                  errors.dueDate ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                disabled={isLoading}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>

            {/* Assign Member */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To *
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className={`w-full px-4 py-2.5 border ${
                  errors.assignedTo ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                disabled={isLoading}
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName} ({member.email})
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>
              )}
            </div>

            {/* GitHub Issue Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Issue Link
              </label>
              <input
                type="text"
                value={formData.githubIssueLink}
                onChange={(e) =>
                  setFormData({ ...formData, githubIssueLink: e.target.value })
                }
                className={`w-full px-4 py-2.5 border ${
                  errors.githubIssueLink ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="https://github.com/username/repo/issues/123"
                disabled={isLoading}
              />
              {errors.githubIssueLink && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.githubIssueLink}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : initialData ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
