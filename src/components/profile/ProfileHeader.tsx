// src/components/profile/ProfileHeader.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, CheckCircle } from "lucide-react";
import type { UserProfile } from "../../types/profile.types";
import type { Member } from "../../types/member.types";

interface ProfileHeaderProps {
  profile: UserProfile;
  member: Member | null;
  completionPct: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  member,
  completionPct,
}) => {
  const navigate = useNavigate();
  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
  const displayName =
    member?.name ?? `${profile.firstName} ${profile.lastName}`.trim();
  const roleLabel = member?.role ?? profile.role;

  return (
    <div className="relative">
      {/* Gradient banner */}
      <div className="h-44 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 rounded-t-2xl" />

      {/* Avatar row */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-4">
          {/* Left: avatar + name */}
          <div className="flex items-end gap-4">
            <div className="relative shrink-0">
              {member?.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={displayName}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500
                                to-indigo-600 border-4 border-white shadow-lg
                                flex items-center justify-center text-white text-3xl font-bold"
                >
                  {initials}
                </div>
              )}
              {profile.verified && (
                <span
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full
                                  flex items-center justify-center shadow"
                >
                  <CheckCircle size={18} className="text-blue-600" />
                </span>
              )}
            </div>

            <div className="mb-1">
              <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-sm font-semibold text-indigo-600 bg-indigo-50
                                  px-2.5 py-0.5 rounded-full"
                >
                  {roleLabel}
                </span>
                <span className="text-xs text-gray-400">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* Right: completion + edit */}
          <div className="flex items-center gap-3 mb-1">
            {/* Completion pill */}
            <div
              className="flex items-center gap-2 bg-white border border-gray-200
                             rounded-xl px-3 py-2 shadow-sm"
            >
              <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500
                               transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {completionPct}% complete
              </span>
            </div>

            <button
              onClick={() => navigate("/dashboard/edit-profile")}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700
                         text-white px-4 py-2 rounded-xl text-sm font-semibold
                         transition-colors duration-200 shadow-sm"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
