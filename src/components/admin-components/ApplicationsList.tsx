/**
 * ApplicationsList Component
 * Admin list view for membership applications submitted via "Join Us"
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApplications } from "../../hooks/useApplications";
import type { StatusFilter } from "../../hooks/useApplications";

const PAGE_SIZE = 5;

const STATUS_OPTIONS: StatusFilter[] = [
  "Pending",
  "Accepted",
  "Rejected",
  "All",
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ApplicationsList() {
  const {
    applications,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    fetchApplications,
  } = useApplications("Pending");

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery]);

  const filteredApplications = applications.filter((application) => {
    const query = searchQuery.toLowerCase();
    return (
      application.fullName.toLowerCase().includes(query) ||
      application.email.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredApplications.length / PAGE_SIZE);
  const pageApplications = filteredApplications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // Skeleton loader
  if (loading && applications.length === 0) {
    return (
      <div className="mt-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-gray-200 mr-5" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
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
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Status" : status}
            </option>
          ))}
        </select>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && pageApplications.length === 0 && !error && (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No applications found
          </h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your filters"
              : "No membership applications yet"}
          </p>
        </div>
      )}

      {/* Applications List */}
      {pageApplications.map((application) => (
        <div
          key={application.id}
          className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-4 border border-gray-100 flex items-start"
        >
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-5 flex-shrink-0 overflow-hidden">
            {application.imageUrl ? (
              <img
                src={application.imageUrl}
                alt={application.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-lg font-semibold">
                {getInitials(application.fullName)}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {application.fullName}
                </h3>
                <p className="text-sm text-gray-500">{application.email}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(application.status)} flex-shrink-0`}
              >
                {application.status}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400">
                {formatDate(application.createdAt)}
              </p>
              <Link
                to={`/admin/applications/${application.id}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {filteredApplications.length > PAGE_SIZE && (
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
    </div>
  );
}
