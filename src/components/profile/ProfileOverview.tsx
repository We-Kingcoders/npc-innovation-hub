// src/components/profile/ProfileOverview.tsx

import React from "react";
import { Mail, Phone, User, Calendar } from "lucide-react";
import type { UserProfile } from "../../types/profile.types";
import type { Member } from "../../types/member.types";

interface ProfileOverviewProps {
  profile: UserProfile;
  member: Member | null;
}

const Row: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-semibold text-gray-800">{value || "—"}</div>
    </div>
  </div>
);

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  profile,
  member,
}) => {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-5">
      {/* Bio */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3">About</h3>
        {member?.bio ? (
          <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No bio added yet.</p>
        )}
      </div>

      {/* Basic details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-bold text-gray-800 mb-2">Details</h3>
        <Row icon={<Mail size={15} />} label="Email" value={profile.email} />
        <Row icon={<Phone size={15} />} label="Phone" value={profile.phone} />
        <Row icon={<User size={15} />} label="Gender" value={profile.gender} />
        <Row
          icon={<Calendar size={15} />}
          label="Member since"
          value={formatDate(profile.createdAt)}
        />
      </div>
    </div>
  );
};

export default ProfileOverview;
