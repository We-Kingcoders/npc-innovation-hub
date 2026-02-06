/**
 * User Management Filters Component
 *
 * Search and filter controls for user management.
 * Includes search, role filter, and status filter.
 */

import React from "react";
import type { UserRole } from "../../types/user.types";

// ==================== TYPES ====================

interface UserManagementFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: UserRole | "all";
  onRoleFilterChange: (role: UserRole | "all") => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (status: "all" | "active" | "inactive") => void;
  totalUsers: number;
  filteredUsers: number;
}

// ==================== COMPONENT ====================

const UserManagementFilters: React.FC<UserManagementFiltersProps> = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  totalUsers,
  filteredUsers,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* SEARCH BAR */}
        <div className="flex-1 max-w-md">
          <label htmlFor="search" className="sr-only">
            Search users
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* ROLE FILTER */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="roleFilter"
              className="text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              Role:
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) =>
                onRoleFilterChange(e.target.value as UserRole | "all")
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {/* STATUS FILTER */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="statusFilter"
              className="text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(
                  e.target.value as "all" | "active" | "inactive",
                )
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* RESULTS COUNT */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Showing <span className="font-semibold">{filteredUsers}</span> of{" "}
            <span className="font-semibold">{totalUsers}</span> users
          </div>
        </div>
      </div>

      {/* ACTIVE FILTERS SUMMARY */}
      {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: "{searchQuery}"
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 hover:text-blue-900"
                title="Clear search"
              >
                ×
              </button>
            </span>
          )}

          {roleFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Role: {roleFilter}
              <button
                onClick={() => onRoleFilterChange("all")}
                className="ml-1 hover:text-purple-900"
                title="Clear role filter"
              >
                ×
              </button>
            </span>
          )}

          {statusFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Status: {statusFilter}
              <button
                onClick={() => onStatusFilterChange("all")}
                className="ml-1 hover:text-green-900"
                title="Clear status filter"
              >
                ×
              </button>
            </span>
          )}

          <button
            onClick={() => {
              onSearchChange("");
              onRoleFilterChange("all");
              onStatusFilterChange("all");
            }}
            className="text-xs text-gray-600 hover:text-gray-900 underline ml-2"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagementFilters;
