/**
 * useAuth Hook
 *
 * Custom hook to access authentication context.
 * Provides convenient access to auth state and methods throughout the application.
 * Place in: src/hooks/useAuth.ts (REPLACE existing)
 *
 * @example
 * ```tsx
 * import { useAuth } from '../hooks/useAuth';
 *
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <div>Please log in</div>;
 *   }
 *
 *   return <div>Welcome, {user?.email}!</div>;
 * }
 * ```
 */

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthContextType } from "../contexts/AuthContext";

/**
 * Hook to access the authentication context
 *
 * @throws Error if used outside of AuthProvider
 * @returns Authentication context with user state and auth methods
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
        "Make sure your component is wrapped with <AuthProvider>.",
    );
  }

  return context;
};

/**
 * Hook to check if user has a specific role
 *
 * @param requiredRole - Role to check for
 * @returns Boolean indicating if user has the required role
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const isAdmin = useRequireRole('Admin');
 *
 *   if (!isAdmin) {
 *     return <div>Access denied</div>;
 *   }
 *
 *   return <div>Admin content</div>;
 * }
 * ```
 */
export const useRequireRole = (requiredRole: string): boolean => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.role === requiredRole;
};

/**
 * Hook to get user information
 *
 * @returns Current user object or null
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const user = useUser();
 *
 *   if (!user) {
 *     return <div>Not logged in</div>;
 *   }
 *
 *   return <div>{user.email}</div>;
 * }
 * ```
 */
export const useUser = () => {
  const { user } = useAuth();
  return user;
};
