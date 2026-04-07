// src/components/profile/ProfileStats.tsx

import React from "react";
import { Code, GraduationCap, Phone, Layers } from "lucide-react";
import type { Member } from "../../types/member.types";

interface ProfileStatsProps {
  member: Member | null;
  completionPct: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  member,
  completionPct,
}) => {
  const totalSkills = member?.skillDetails?.length ?? 0;
  const hasBio = !!member?.bio;
  const hasEdu = !!member?.education?.degree;
  const hasContacts = Object.values(member?.contacts ?? {}).some(Boolean);

  const expLevel =
    totalSkills >= 4
      ? "Expert"
      : totalSkills >= 2
        ? "Intermediate"
        : totalSkills >= 1
          ? "Beginner"
          : "—";

  const expColor =
    expLevel === "Expert"
      ? "text-green-600 bg-green-50"
      : expLevel === "Intermediate"
        ? "text-blue-600 bg-blue-50"
        : expLevel === "Beginner"
          ? "text-yellow-600 bg-yellow-50"
          : "text-gray-500 bg-gray-100";

  const stats = [
    {
      icon: <Code size={16} />,
      label: "Skills",
      value: totalSkills,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      icon: <GraduationCap size={16} />,
      label: "Education",
      value: hasEdu ? "Added" : "—",
      color: "text-purple-600 bg-purple-50",
    },
    {
      icon: <Phone size={16} />,
      label: "Contacts",
      value: hasContacts ? "Added" : "—",
      color: "text-green-600 bg-green-50",
    },
    {
      icon: <Layers size={16} />,
      label: "Level",
      value: expLevel,
      color: expColor,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4">Profile Stats</h3>

      {/* Profile completion */}
      <div className="mb-5">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
          <span>Profile Completion</span>
          <span className="font-bold text-gray-800">{completionPct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500
                        transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        {completionPct < 100 && (
          <p className="text-[11px] text-orange-500 font-medium mt-1.5">
            {!hasBio ? "Add a bio to improve your profile. " : ""}
            {!hasEdu ? "Add education details. " : ""}
            {!hasContacts ? "Add contact links. " : ""}
            {totalSkills === 0 ? "Add at least one skill." : ""}
          </p>
        )}
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3 border border-gray-100"
          >
            <div className={`p-2 rounded-lg ${s.color}`}>{s.icon}</div>
            <div>
              <div className="text-sm font-bold text-gray-900">{s.value}</div>
              <div className="text-[10px] text-gray-400 font-medium">
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;
