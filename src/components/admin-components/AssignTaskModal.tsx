/**
 * AssignTaskModal Component
 * Lightweight modal for reassigning tasks
 */
import React from "react";
import { useState, useEffect } from "react";
import type { User } from "../../types/task.types";

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    userId: string;
    githubIssueLink?: string;
  }) => Promise<void>;
  members: User[];
  currentAssignee?: string;
  isLoading?: boolean;
}

export const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  members,
  currentAssignee,
  isLoading = false,
}) => {
  const [userId, setUserId] = useState("");
  const [githubIssueLink, setGithubIssueLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUserId(currentAssignee || "");
      setGithubIssueLink("");
      setError("");
    }
  }, [isOpen, currentAssignee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError("Please select a member");
      return;
    }

    const payload: { userId: string; githubIssueLink?: string } = { userId };
    if (githubIssueLink.trim()) {
      payload.githubIssueLink = githubIssueLink;
    }

    await onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Reassign Task</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5"
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Member Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To *
              </label>
              <select
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError("");
                }}
                className={`w-full px-4 py-2.5 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                disabled={isLoading}
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName} - {member.email}
                  </option>
                ))}
              </select>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            {/* Optional GitHub Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Issue Link (Optional)
              </label>
              <input
                type="text"
                value={githubIssueLink}
                onChange={(e) => setGithubIssueLink(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://github.com/username/repo/issues/123"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                  Assigning...
                </>
              ) : (
                "Assign Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
