// src/components/dashboard/ProfileCard.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, UserCircle } from "lucide-react";
import { useMember } from "../../hooks/useMember";
import { getUserInitials } from "../../types/user.types";
import type { User } from "../../types/user.types";

interface ProfileCardProps {
  user: User | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { member, fetchMember } = useMember();

  // Fetch member profile to get the uploaded image
  useEffect(() => {
    if (user?.id) fetchMember(user.id);
  }, [user?.id, fetchMember]);

  const initials = user ? getUserInitials(user) : "?";
  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Member";
  const role = member?.role ?? user?.role ?? "";
  const email = user?.email ?? "";

  // Prefer member profile image (uploaded via /api/members),
  // fall back to auth user image, then show initials
  const avatarUrl = member?.imageUrl || user?.image || null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
            />
          ) : (
            <div
              className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600
                            rounded-full flex items-center justify-center text-white
                            text-xl font-bold select-none"
            >
              {initials}
            </div>
          )}
          {/* Online dot */}
          <span
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500
                           rounded-full border-2 border-white"
          />
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-gray-900 mb-0.5">
          {member?.name || fullName}
        </h3>

        {/* Role badge */}
        {role && (
          <span
            className="text-xs font-semibold text-indigo-600 bg-indigo-50
                           px-2.5 py-0.5 rounded-full mb-1"
          >
            {role}
          </span>
        )}

        {/* Email */}
        {email && (
          <p className="text-xs text-gray-400 mb-5 truncate max-w-full">
            {email}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 w-full">
          <button
            onClick={() => navigate("/dashboard/edit-profile")}
            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600
                       hover:bg-indigo-700 text-white px-3 py-2.5 rounded-lg text-xs
                       font-semibold transition-colors duration-200"
          >
            <Settings size={13} />
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100
                       hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-lg text-xs
                       font-semibold transition-colors duration-200"
          >
            <UserCircle size={13} />
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
