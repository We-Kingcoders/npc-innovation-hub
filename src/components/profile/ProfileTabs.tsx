// src/components/profile/ProfileTabs.tsx

import React from "react";

export type ProfileTab = "overview" | "skills" | "education" | "contacts";

interface Tab {
  value: ProfileTab;
  label: string;
}

const TABS: Tab[] = [
  { value: "overview", label: "Overview" },
  { value: "skills", label: "Skills" },
  { value: "education", label: "Education" },
  { value: "contacts", label: "Contacts" },
];

interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ active, onChange }) => (
  <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-7">
    {TABS.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                    ${
                      active === tab.value
                        ? "bg-white text-indigo-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default ProfileTabs;
