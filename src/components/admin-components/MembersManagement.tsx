// import { useState } from "react";

// interface Member {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl: string;
// }

// const allMembers: Member[] = [
//   {
//     id: "1",
//     name: "Costa GASANA",
//     email: "costagasana@gmail.com",
//     avatarUrl: "/avatar1.jpg",
//   },
//   {
//     id: "2",
//     name: "Costa GASANA",
//     email: "costagasana@gmail.com",
//     avatarUrl: "/avatar1.jpg",
//   },
//   {
//     id: "3",
//     name: "Costa GASANA",
//     email: "costagasana@gmail.com",
//     avatarUrl: "/avatar1.jpg",
//   },
//   {
//     id: "4",
//     name: "Costa GASANA",
//     email: "costagasana@gmail.com",
//     avatarUrl: "/avatar1.jpg",
//   },
//   {
//     id: "5",
//     name: "Costa GASANA",
//     email: "costagasana@gmail.com",
//     avatarUrl: "/avatar1.jpg",
//   },
//   {
//     id: "6",
//     name: "Costa GASANA",
//     email: "costagasana@gmail.com",
//     avatarUrl: "/avatar1.jpg",
//   },
//   {
//     id: "7",
//     name: "Costa GASANA",
//     email: "costagasana@gmail.com",
//     avatarUrl: "/assets/images/hero.png",
//   },
//   {
//     id: "8",
//     name: "Costa GASANA",
//     email: "costagasana@gmail.com",
//     avatarUrl: "/avatar1.jpg",
//   },
// ];

// const PAGE_SIZE = 4;

// export default function MembersManagement() {
//   const [page, setPage] = useState(1);

//   const pageCount = Math.ceil(allMembers.length / PAGE_SIZE);

//   const pagedMembers = allMembers.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE,
//   );

//   const handlePageChange = (p: number) => {
//     if (p < 1 || p > pageCount) return;
//     setPage(p);
//   };

//   return (
//     <div className="flex-1 px-8 py-6">
//       <h2 className="text-3xl font-bold mb-8">Members management</h2>
//       <div className="flex flex-col gap-6">
//         {pagedMembers.map((member) => (
//           <div
//             key={member.id}
//             className="flex items-center gap-6 border rounded-lg px-8 py-4 bg-white"
//           >
//             <img
//               src={member.avatarUrl}
//               alt="avatar"
//               className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
//             />
//             <div className="flex-1">
//               <div className="text-xl font-bold">{member.name}</div>
//               <div className="text-blue-600 text-lg">{member.email}</div>
//             </div>
//             <div className="flex flex-col gap-2">
//               <button>
//                 <span className="w-2 h-2 bg-black rounded-full block"></span>
//               </button>
//               <button>
//                 <span className="w-2 h-2 bg-black rounded-full block"></span>
//               </button>
//               <button>
//                 <span className="w-2 h-2 bg-black rounded-full block"></span>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-end mt-8">
//         <nav className="flex gap-2">
//           <button
//             className="w-8 h-8 flex items-center justify-center rounded border text-[#1B2531] bg-white"
//             onClick={() => handlePageChange(page - 1)}
//             disabled={page === 1}
//           >
//             &lt;
//           </button>
//           {Array.from({ length: pageCount }, (_, i) => (
//             <button
//               key={i + 1}
//               className={`w-8 h-8 flex items-center justify-center rounded border ${page === i + 1 ? "text-white bg-[#0C2340]" : "text-[#1B2531] bg-white"}`}
//               onClick={() => handlePageChange(i + 1)}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             className="w-8 h-8 flex items-center justify-center rounded border text-[#1B2531] bg-white"
//             onClick={() => handlePageChange(page + 1)}
//             disabled={page === pageCount}
//           >
//             &gt;
//           </button>
//         </nav>
//       </div>
//     </div>
//   );
// }

/**
 * Members Management Component (Updated)
 *
 * Main component for admin user management.
 * Integrates with backend API through member.api.ts.
 * Handles all CRUD operations with proper error handling and loading states.
 */

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import type { User, UserRole } from "../../types/user.types";
import {
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  searchUsers,
  filterUsersByRole,
  filterUsersByStatus,
} from "../../api/admin/member.api";
import UserManagementTable from "./UserManagementTable";
import UserManagementFilters from "./UserManagementFilters";

// ==================== COMPONENT ====================

const MembersManagement: React.FC = () => {
  // ==================== STATE ====================

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // ==================== FETCH USERS ====================

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedUsers = await getAllUsers();

      // Ensure we always have an array
      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
      } else {
        console.error("API returned non-array data:", fetchedUsers);
        setUsers([]);
        setError("Invalid data format received from server");
        toast.error("Invalid data format received from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      setUsers([]); // Set to empty array on error
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================== FILTERED USERS ====================

  const filteredUsers = useMemo(() => {
    // Ensure users is always an array
    if (!Array.isArray(users)) {
      console.warn("users is not an array:", users);
      return [];
    }

    let result = users;

    // Apply search filter
    if (searchQuery) {
      result = searchUsers(result, searchQuery);
    }

    // Apply role filter
    result = filterUsersByRole(result, roleFilter);

    // Apply status filter
    result = filterUsersByStatus(result, statusFilter);

    return result;
  }, [users, searchQuery, roleFilter, statusFilter]);

  // ==================== HANDLERS ====================

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const updatedUser = await updateUserRole(userId, newRole);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? updatedUser : user)),
      );

      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update role";
      toast.error(errorMessage);
      throw err; // Re-throw to let table handle loading state
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      const updatedUser = await toggleUserStatus(userId);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? updatedUser : user)),
      );

      const statusText = updatedUser.isActive ? "activated" : "deactivated";
      toast.success(`User account ${statusText}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update status";
      toast.error(errorMessage);
      throw err; // Re-throw to let table handle loading state
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);

      // Remove from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast.success("User deleted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      toast.error(errorMessage);
      throw err; // Re-throw to let table handle loading state
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="flex-1 px-8 py-6">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Members Management
        </h2>
        <p className="text-gray-600">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* ERROR STATE */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading users
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={fetchUsers}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS */}
      {!isLoading && !error && (
        <UserManagementFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          totalUsers={users.length}
          filteredUsers={filteredUsers.length}
        />
      )}

      {/* TABLE */}
      <UserManagementTable
        users={filteredUsers}
        isLoading={isLoading}
        onRoleChange={handleRoleChange}
        onStatusToggle={handleStatusToggle}
        onDeleteUser={handleDeleteUser}
      />

      {/* REFRESH BUTTON */}
      {!isLoading && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={fetchUsers}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;
