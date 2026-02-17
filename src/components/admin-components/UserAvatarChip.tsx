/**
 * UserAvatarChip Component
 * Avatar with user name
 */

import React from "react";
import type { User } from "../../types/task.types";
import { getUserFullName, getUserInitials } from "../../types/task.types";

interface UserAvatarChipProps {
  user: User;
  showEmail?: boolean;
}

export const UserAvatarChip: React.FC<UserAvatarChipProps> = ({
  user,
  showEmail = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-xs shadow-md">
        {getUserInitials(user)}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {getUserFullName(user)}
        </span>
        {showEmail && (
          <span className="text-xs text-gray-500">{user.email}</span>
        )}
      </div>
    </div>
  );
};
