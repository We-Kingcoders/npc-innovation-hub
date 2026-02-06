// /**
//  * Member API Service
//  *
//  * Service layer for all user/member-related API operations.
//  * Handles communication with backend user endpoints.
//  */

// import apiClient, { handleApiError } from "../client";
// import { USER_ROUTES } from "../routes";
// import type {
//   User,
//   GetUserResponse,
//   UpdateUserRolePayload,
//   UpdateUserRoleResponse,
//   ChangeAccountStatusResponse,
//   DeleteUserResponse,
//   UserRole,
// } from "../../types/user.types";

// // ==================== RESPONSE TYPES ====================

// /**
//  * Response type for GET all users endpoint
//  */
// type GetAllUsersResponse = {
//   status: string;
//   results: number;
//   data: {
//     users: User[];
//   };
// };

// // ==================== GET ALL USERS ====================

// /**
//  * Fetch all users from the system
//  * @returns Promise with array of users
//  */
// export const getAllUsers = async (): Promise<User[]> => {
//   try {
//     const response = await apiClient.get<GetAllUsersResponse>(
//       USER_ROUTES.GET_ALL_USERS,
//     );
//     // Access the nested users array from the response structure
//     return response.data.data.users;
//   } catch (error) {
//     const errorMessage = handleApiError(error);
//     throw new Error(`Failed to fetch users: ${errorMessage}`);
//   }
// };

// // ==================== GET USER BY ID ====================

// /**
//  * Fetch a single user by ID
//  * @param id - User ID
//  * @returns Promise with user data
//  */
// export const getUserById = async (id: string): Promise<User> => {
//   try {
//     const response = await apiClient.get<GetUserResponse>(
//       USER_ROUTES.GET_USER_BY_ID(id),
//     );
//     return response.data.user;
//   } catch (error) {
//     const errorMessage = handleApiError(error);
//     throw new Error(`Failed to fetch user: ${errorMessage}`);
//   }
// };

// // ==================== UPDATE USER ROLE ====================

// /**
//  * Update a user's role (Admin only)
//  * @param id - User ID
//  * @param role - New role (Admin or Member)
//  * @returns Promise with updated user data
//  */
// export const updateUserRole = async (
//   id: string,
//   role: UserRole,
// ): Promise<User> => {
//   try {
//     const payload: UpdateUserRolePayload = { role };

//     const response = await apiClient.patch<UpdateUserRoleResponse>(
//       USER_ROUTES.UPDATE_USER_ROLE(id),
//       payload,
//     );

//     return response.data.user;
//   } catch (error) {
//     const errorMessage = handleApiError(error);
//     throw new Error(`Failed to update user role: ${errorMessage}`);
//   }
// };

// // ==================== TOGGLE USER STATUS ====================

// /**
//  * Activate or deactivate a user account (Admin only)
//  * @param id - User ID
//  * @returns Promise with updated user data
//  */
// export const toggleUserStatus = async (id: string): Promise<User> => {
//   try {
//     const response = await apiClient.patch<ChangeAccountStatusResponse>(
//       USER_ROUTES.CHANGE_ACCOUNT_STATUS(id),
//     );

//     return response.data.user;
//   } catch (error) {
//     const errorMessage = handleApiError(error);
//     throw new Error(`Failed to change user status: ${errorMessage}`);
//   }
// };

// // ==================== DELETE USER ====================

// /**
//  * Delete a user from the system (Admin only)
//  * @param id - User ID
//  * @returns Promise with success message
//  */
// export const deleteUser = async (id: string): Promise<string> => {
//   try {
//     const response = await apiClient.delete<DeleteUserResponse>(
//       USER_ROUTES.DELETE_USER(id),
//     );

//     return response.data.message;
//   } catch (error) {
//     const errorMessage = handleApiError(error);
//     throw new Error(`Failed to delete user: ${errorMessage}`);
//   }
// };

// // ==================== GET CURRENT USER ====================

// /**
//  * Get the currently authenticated user's profile
//  * @returns Promise with current user data
//  */
// export const getCurrentUser = async (): Promise<User> => {
//   try {
//     const response = await apiClient.get<GetUserResponse>(
//       USER_ROUTES.GET_CURRENT_USER,
//     );
//     return response.data.user;
//   } catch (error) {
//     const errorMessage = handleApiError(error);
//     throw new Error(`Failed to fetch current user: ${errorMessage}`);
//   }
// };

// // ==================== BULK OPERATIONS ====================

// /**
//  * Delete multiple users at once
//  * @param ids - Array of user IDs
//  * @returns Promise with results for each deletion
//  */
// export const deleteMultipleUsers = async (
//   ids: string[],
// ): Promise<{ success: string[]; failed: string[] }> => {
//   const results = {
//     success: [] as string[],
//     failed: [] as string[],
//   };

//   await Promise.allSettled(
//     ids.map(async (id) => {
//       try {
//         await deleteUser(id);
//         results.success.push(id);
//       } catch {
//         results.failed.push(id);
//       }
//     }),
//   );

//   return results;
// };

// /**
//  * Update multiple users' roles at once
//  * @param updates - Array of {id, role} objects
//  * @returns Promise with results for each update
//  */
// export const updateMultipleUserRoles = async (
//   updates: Array<{ id: string; role: UserRole }>,
// ): Promise<{ success: string[]; failed: string[] }> => {
//   const results = {
//     success: [] as string[],
//     failed: [] as string[],
//   };

//   await Promise.allSettled(
//     updates.map(async ({ id, role }) => {
//       try {
//         await updateUserRole(id, role);
//         results.success.push(id);
//       } catch {
//         results.failed.push(id);
//       }
//     }),
//   );

//   return results;
// };

// // ==================== UTILITY FUNCTIONS ====================

// /**
//  * Search users by name or email
//  * Note: This is a client-side filter. For better performance,
//  * implement server-side search in the backend.
//  */
// export const searchUsers = (users: User[], query: string): User[] => {
//   const lowercaseQuery = query.toLowerCase().trim();

//   if (!lowercaseQuery) {
//     return users;
//   }

//   return users.filter((user) => {
//     const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
//     const email = user.email.toLowerCase();

//     return fullName.includes(lowercaseQuery) || email.includes(lowercaseQuery);
//   });
// };

// /**
//  * Filter users by role
//  */
// export const filterUsersByRole = (
//   users: User[],
//   role: UserRole | "all",
// ): User[] => {
//   if (role === "all") {
//     return users;
//   }

//   return users.filter((user) => user.role === role);
// };

// /**
//  * Filter users by status
//  */
// export const filterUsersByStatus = (
//   users: User[],
//   status: "active" | "inactive" | "all",
// ): User[] => {
//   if (status === "all") {
//     return users;
//   }

//   return users.filter((user) =>
//     status === "active" ? user.isActive : !user.isActive,
//   );
// };

// /**
//  * Sort users by field
//  */
// export const sortUsers = (
//   users: User[],
//   field: keyof User,
//   order: "asc" | "desc",
// ): User[] => {
//   return [...users].sort((a, b) => {
//     const aValue = a[field];
//     const bValue = b[field];

//     // Handle null/undefined values
//     if (aValue == null && bValue == null) return 0;
//     if (aValue == null) return order === "asc" ? 1 : -1;
//     if (bValue == null) return order === "asc" ? -1 : 1;

//     if (aValue < bValue) return order === "asc" ? -1 : 1;
//     if (aValue > bValue) return order === "asc" ? 1 : -1;
//     return 0;
//   });
// };

/**
 * Member API Service
 *
 * Service layer for all user/member-related API operations.
 * Handles communication with backend user endpoints.
 *
 * UPDATED to match your actual backend response structures
 */

import apiClient, { handleApiError } from "../client";
import { USER_ROUTES } from "../routes";
import type { User, UserRole } from "../../types/user.types";

// ==================== RESPONSE TYPES ====================

/**
 * Response type for GET all users endpoint
 * Matches: { status, results, data: { users: [] } }
 */
type GetAllUsersResponse = {
  status: string;
  results: number;
  data: {
    users: User[];
  };
};

/**
 * Response for role update
 * Matches: { status, message, data: { user: {} } }
 */
type UpdateRoleResponse = {
  status: string;
  message: string;
  data: {
    user: User;
  };
};

/**
 * Response for status toggle
 * Matches: { message, reason }
 */
type StatusToggleResponse = {
  message: string;
  reason?: string;
};

// ==================== GET ALL USERS ====================

/**
 * Fetch all users from the system
 * @returns Promise with array of users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<GetAllUsersResponse>(
      USER_ROUTES.GET_ALL_USERS,
    );
    return response.data.data.users;
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(`Failed to fetch users: ${errorMessage}`);
  }
};

// ==================== UPDATE USER ROLE ====================

/**
 * Update a user's role (Admin only)
 * @param id - User ID
 * @param role - New role (Admin or Member)
 * @returns Promise with updated user data
 */
export const updateUserRole = async (
  id: string,
  role: UserRole,
): Promise<User> => {
  try {
    const response = await apiClient.patch<UpdateRoleResponse>(
      USER_ROUTES.UPDATE_USER_ROLE(id),
      { role },
    );

    // Your backend returns: { status, message, data: { user } }
    return response.data.data.user;
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(`Failed to update user role: ${errorMessage}`);
  }
};

// ==================== TOGGLE USER STATUS ====================

/**
 * Toggle user account status (Admin only)
 * Note: This endpoint doesn't return the updated user,
 * so caller should refetch all users after success
 *
 * @param id - User ID
 * @returns Promise that resolves when status is toggled
 */
export const toggleUserStatus = async (id: string): Promise<void> => {
  try {
    await apiClient.patch<StatusToggleResponse>(
      USER_ROUTES.CHANGE_ACCOUNT_STATUS(id),
      {
        activationReason: "Admin requested status change",
      },
    );

    // Backend returns: { message, reason } (no user object)
    // Caller needs to refetch users to get updated data
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(`Failed to change user status: ${errorMessage}`);
  }
};

// ==================== DELETE USER ====================

// ==================== DELETE USER ====================

/**
 * Response for delete user
 * Matches your backend delete response structure
 */
type DeleteUserResponse = {
  status: string;
  message: string;
};

/**
 * Delete a user from the system (Admin only)
 * @param id - User ID
 * @returns Promise with success message
 */
export const deleteUser = async (id: string): Promise<string> => {
  try {
    const response = await apiClient.delete<DeleteUserResponse>(
      USER_ROUTES.DELETE_USER(id),
    );
    return response.data.message || "User deleted successfully";
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(`Failed to delete user: ${errorMessage}`);
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Search users by name or email
 * Client-side filter
 */
export const searchUsers = (users: User[], query: string): User[] => {
  const lowercaseQuery = query.toLowerCase().trim();

  if (!lowercaseQuery) {
    return users;
  }

  return users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    return fullName.includes(lowercaseQuery) || email.includes(lowercaseQuery);
  });
};

/**
 * Filter users by role
 */
export const filterUsersByRole = (
  users: User[],
  role: UserRole | "all",
): User[] => {
  if (role === "all") {
    return users;
  }
  return users.filter((user) => user.role === role);
};

/**
 * Filter users by status
 */
export const filterUsersByStatus = (
  users: User[],
  status: "active" | "inactive" | "all",
): User[] => {
  if (status === "all") {
    return users;
  }
  return users.filter((user) =>
    status === "active" ? user.isActive : !user.isActive,
  );
};

/**
 * Sort users by field
 */
export const sortUsers = (
  users: User[],
  field: keyof User,
  order: "asc" | "desc",
): User[] => {
  return [...users].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return order === "asc" ? 1 : -1;
    if (bValue == null) return order === "asc" ? -1 : 1;

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
};
