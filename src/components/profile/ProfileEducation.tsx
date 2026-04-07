// src/components/profile/ProfileEducation.tsx

import React from "react";
import { GraduationCap } from "lucide-react";
import type { Member } from "../../types/member.types";

interface ProfileEducationProps {
  member: Member | null;
}

const ProfileEducation: React.FC<ProfileEducationProps> = ({ member }) => {
  const edu = member?.education;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-gray-800 mb-5">Education</h3>

      {!edu?.degree ? (
        <div className="flex flex-col items-center py-8 text-gray-400 gap-2">
          <GraduationCap size={28} className="opacity-30" />
          <p className="text-sm">No education added yet.</p>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Logo */}
          <div
            className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0
                          flex items-center justify-center border border-gray-200"
          >
            {edu.imageUrl ? (
              <img
                src={edu.imageUrl}
                alt={edu.institution}
                className="w-full h-full object-contain"
              />
            ) : (
              <GraduationCap size={24} className="text-gray-300" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900">{edu.degree}</h4>
            <p className="text-sm text-indigo-600 font-semibold mt-0.5">
              {edu.institution}
            </p>
            {edu.description && (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {edu.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEducation;
