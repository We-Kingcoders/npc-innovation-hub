/**
 * HireRequests Component
 * Modern admin list view for hire inquiries
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { HireInquiry } from "../../types/hire.types";
import { useHireInquiries } from "../../hooks/useHireInquiries";
import { ReplyModal } from "./ReplyModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Toast, useToast } from "./Toast";

const PAGE_SIZE = 5;

export default function HireRequests() {
  const {
    inquiries,
    loading,
    error,
    fetchInquiries,
    handleDelete,
    handleReply,
  } = useHireInquiries();

  const { toast, showToast, hideToast } = useToast();
  const [page, setPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<HireInquiry | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Pending" | "Reviewed" | "Contacted" | "Rejected"
  >("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch inquiries on mount
  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInquiries.length / PAGE_SIZE);
  const pageInquiries = filteredInquiries.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Contacted":
        return "bg-green-100 text-green-800";
      case "Reviewed":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleReplyClick = (inquiry: HireInquiry) => {
    setSelectedInquiry(inquiry);
    setShowReplyModal(true);
    setMenuOpenId(null);
  };

  const handleDeleteClick = (inquiry: HireInquiry) => {
    setSelectedInquiry(inquiry);
    setShowDeleteModal(true);
    setMenuOpenId(null);
  };

  const confirmDelete = async () => {
    if (!selectedInquiry) return;

    setIsDeleting(true);
    const success = await handleDelete(selectedInquiry.id);
    if (success) {
      setShowDeleteModal(false);
      setSelectedInquiry(null);
      showToast("Inquiry deleted successfully!", "success");
    } else {
      showToast(error || "Failed to delete inquiry", "error");
    }
    setIsDeleting(false);
  };

  const submitReply = async (subject: string, message: string) => {
    if (!selectedInquiry) return;

    setIsReplying(true);
    const success = await handleReply(selectedInquiry.id, { subject, message });
    if (success) {
      setShowReplyModal(false);
      setSelectedInquiry(null);
      showToast("Reply sent successfully!", "success");
    } else {
      showToast(error || "Failed to send reply", "error");
    }
    setIsReplying(false);
  };

  // Skeleton loader
  if (loading && inquiries.length === 0) {
    return (
      <div className="mt-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 mr-6" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search inquiries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Contacted">Contacted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && pageInquiries.length === 0 && (
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No inquiries found
          </h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "No hire inquiries yet"}
          </p>
        </div>
      )}

      {/* Inquiries List */}
      {pageInquiries.map((inquiry) => (
        <div
          key={inquiry.id}
          className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-4 border border-gray-100 flex items-start"
        >
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-5 flex-shrink-0">
            <span className="text-white text-lg font-semibold">
              {inquiry.first_name.charAt(0)}
              {inquiry.last_name.charAt(0)}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {inquiry.company_name} - {inquiry.job_title}
                </h3>
                <p className="text-sm text-gray-600">
                  From: {inquiry.first_name} {inquiry.last_name}
                </p>
                <p className="text-sm text-gray-500">{inquiry.email}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(inquiry.status)} flex-shrink-0`}
              >
                {inquiry.status}
              </span>
            </div>

            <p className="text-gray-700 mt-2 mb-3 line-clamp-2">
              {inquiry.message}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {formatDate(inquiry.created_at)}
              </p>
              <Link
                to={`/admin/hire-inquiries/${inquiry.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative ml-4 flex-shrink-0" ref={menuRef}>
            <button
              onClick={() =>
                setMenuOpenId(menuOpenId === inquiry.id ? null : inquiry.id)
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Options"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {menuOpenId === inquiry.id && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <Link
                  to={`/admin/hire-inquiries/${inquiry.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setMenuOpenId(null)}
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleReplyClick(inquiry)}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Send Reply
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => handleDeleteClick(inquiry)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {filteredInquiries.length > PAGE_SIZE && (
        <div className="flex justify-end items-center gap-3 mt-8">
          <button
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <ReplyModal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setSelectedInquiry(null);
        }}
        onSubmit={submitReply}
        isLoading={isReplying}
        inquiryName={
          selectedInquiry
            ? `${selectedInquiry.first_name} ${selectedInquiry.last_name}`
            : ""
        }
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Inquiry"
        message={`Are you sure you want to delete the inquiry from ${selectedInquiry?.company_name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedInquiry(null);
        }}
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
