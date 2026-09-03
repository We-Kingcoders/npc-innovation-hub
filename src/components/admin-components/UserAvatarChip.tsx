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
      <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-white font-semibold text-xs shadow-md">
        {getUserInitials(user)}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-navy-800">
          {getUserFullName(user)}
        </span>
        {showEmail && (
          <span className="text-xs text-mist-500">{user.email}</span>
        )}
      </div>
    </div>
  );
};
