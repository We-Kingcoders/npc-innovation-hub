// src/components/profile/ProfileSkills.tsx

import React from "react";
import { Code } from "lucide-react";
import type { Member } from "../../types/member.types";

interface ProfileSkillsProps {
  member: Member | null;
}

const BAR_COLORS = [
  "from-blue-500 to-indigo-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-teal-500",
  "from-orange-400 to-amber-500",
];

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ member }) => {
  const skills = member?.skillDetails ?? [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-gray-800 mb-5">
        Skills & Technologies
      </h3>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-gray-400 gap-2">
          <Code size={28} className="opacity-30" />
          <p className="text-sm">No skills added yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {skills.map((skill, idx) => (
            <div key={skill.name}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold text-gray-800">
                  {skill.name}
                </span>
                <span className="text-xs font-bold text-indigo-600">
                  {skill.percent}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r ${BAR_COLORS[idx % BAR_COLORS.length]}
                               transition-all duration-700`}
                  style={{ width: `${skill.percent}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skill.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5
                               rounded-full font-medium border border-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSkills;
