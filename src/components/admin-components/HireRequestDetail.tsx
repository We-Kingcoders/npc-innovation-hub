/**
 * HireRequestDetail Component
 * Detail view for a single hire inquiry with actions
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useHireInquiry } from "../../hooks/useHireInquiries";
import { ReplyModal } from "./ReplyModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Toast, useToast } from "./Toast";
import type { InquiryStatus } from "../../types/hire.types";

const STATUS_OPTIONS: InquiryStatus[] = [
  "Pending",
  "Reviewed",
  "Contacted",
  "Rejected",
];

export default function HireRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    inquiry,
    loading,
    error,
    handleUpdateStatus,
    handleReply,
    handleDelete,
  } = useHireInquiry(id || "");

  const { toast, showToast, hideToast } = useToast();
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Contacted":
        return "bg-green-100 text-green-800 border-green-200";
      case "Reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (!inquiry || inquiry.status === newStatus) return;

    setIsUpdatingStatus(true);
    const success = await handleUpdateStatus({ status: newStatus });
    if (success) {
      showToast(`Status updated to ${newStatus}`, "success");
    } else {
      showToast(error || "Failed to update status", "error");
    }
    setIsUpdatingStatus(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const success = await handleDelete();
    if (success) {
      showToast("Inquiry deleted successfully!", "success");
      setTimeout(() => {
        navigate("/hire-requests");
      }, 1500);
    } else {
      showToast(error || "Failed to delete inquiry", "error");
      setIsDeleting(false);
    }
  };

  const submitReply = async (subject: string, message: string) => {
    setIsReplying(true);
    const success = await handleReply({ subject, message });
    if (success) {
      setShowReplyModal(false);
      showToast("Reply sent successfully!", "success");
    } else {
      showToast(error || "Failed to send reply", "error");
    }
    setIsReplying(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <Topbar />

        {/* Back Button */}
        <button
          onClick={() => navigate("/hire-requests")}
          className="mb-6 text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center gap-2"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Inquiries
        </button>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Inquiry
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        )}

        {/* Detail View */}
        {inquiry && !loading && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {inquiry.company_name}
                  </h1>
                  <p className="text-blue-100">{inquiry.job_title}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReplyModal(true)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2"
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
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    Reply
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
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
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-gray-900 mt-1">
                      {inquiry.first_name} {inquiry.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900 mt-1">{inquiry.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Country
                    </label>
                    <p className="text-gray-900 mt-1">{inquiry.country}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        value={inquiry.status}
                        onChange={(e) =>
                          handleStatusChange(e.target.value as InquiryStatus)
                        }
                        disabled={isUpdatingStatus}
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(inquiry.status)} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Message
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {inquiry.message}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Created: {formatDate(inquiry.created_at)}</span>
                  <span>Last Updated: {formatDate(inquiry.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        onSubmit={submitReply}
        isLoading={isReplying}
        inquiryName={
          inquiry ? `${inquiry.first_name} ${inquiry.last_name}` : ""
        }
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Inquiry"
        message={`Are you sure you want to delete this inquiry from ${inquiry?.company_name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
