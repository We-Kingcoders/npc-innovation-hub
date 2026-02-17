/**
 * TaskDetailsModal Component
 * Modal for viewing task details with actions
 */

import React from "react";
import type { Task } from "../../types/task.types";
import {
  getDaysUntilDue,
  getUserFullName,
  getUserInitials,
  isTaskOverdue,
} from "../../types/task.types";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: () => void;
  onDelete: () => void;
  onReassign: () => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onReassign,
}) => {
  if (!isOpen || !task) return null;

  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const daysInfo = getDaysUntilDue(task.dueDate);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">{task.title}</h2>
              <div className="flex items-center gap-3">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors ml-4"
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
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Status Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Task Progress
              </span>
              <span className="text-sm text-gray-600">
                {task.status === "completed"
                  ? "100%"
                  : task.status === "in-progress"
                    ? "50%"
                    : "0%"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  task.status === "completed"
                    ? "bg-green-500 w-full"
                    : task.status === "in-progress"
                      ? "bg-blue-500 w-1/2"
                      : "bg-yellow-500 w-0"
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {task.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Creator */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">
                Created By
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {getUserInitials(task.creator)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getUserFullName(task.creator)}
                  </p>
                  <p className="text-sm text-gray-500">{task.creator.email}</p>
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">
                Assigned To
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {getUserInitials(task.assignee)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getUserFullName(task.assignee)}
                  </p>
                  <p className="text-sm text-gray-500">{task.assignee.email}</p>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">
                Due Date
              </h4>
              <div
                className={`${isOverdue ? "text-red-600" : "text-gray-900"}`}
              >
                <p className="font-medium">
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p
                  className={`text-sm ${isOverdue ? "font-semibold" : "text-gray-500"}`}
                >
                  {daysInfo}
                </p>
              </div>
            </div>

            {/* GitHub Link */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">
                GitHub Issue
              </h4>
              {task.githubIssueLink ? (
                <div className="flex items-center gap-2">
                  <a
                    href={task.githubIssueLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 text-sm truncate flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View Issue
                  </a>
                  <button
                    onClick={() => copyToClipboard(task.githubIssueLink)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Copy link"
                  >
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No link provided</p>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created: {new Date(task.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onReassign}
            className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
          >
            Reassign
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Edit Task
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
