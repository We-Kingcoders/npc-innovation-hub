// ============================================================
// QuickActions.tsx
// One-click action buttons for common admin operations
// ============================================================

import React from "react";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  color: string;
  hoverColor: string;
  iconBg: string;
  icon: React.ReactNode;
}

const ACTIONS: QuickAction[] = [
  {
    label: "Create Project",
    description: "Add a new project",
    href: "/dashboard/projects/new",
    color: "text-indigo-700",
    hoverColor: "hover:bg-indigo-50",
    iconBg: "bg-indigo-100",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    label: "Create Event",
    description: "Schedule an event",
    href: "/Admin-events",
    color: "text-violet-700",
    hoverColor: "hover:bg-violet-50",
    iconBg: "bg-violet-100",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="12" y1="14" x2="12" y2="18" />
        <line x1="10" y1="16" x2="14" y2="16" />
      </svg>
    ),
  },
  {
    label: "Add Task",
    description: "Create a new task",
    href: "/Admin-tasks",
    color: "text-amber-700",
    hoverColor: "hover:bg-amber-50",
    iconBg: "bg-amber-100",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
        />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="11" y2="16" />
      </svg>
    ),
  },
  {
    label: "Add Resource",
    description: "Upload a resource",
    href: "/add-resource",
    color: "text-teal-700",
    hoverColor: "hover:bg-teal-50",
    iconBg: "bg-teal-100",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 19.5A2.5 2.5 0 016.5 17H20"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        />
        <line x1="12" y1="7" x2="12" y2="13" />
        <line x1="9" y1="10" x2="15" y2="10" />
      </svg>
    ),
  },
  {
    label: "Manage Members",
    description: "View all members",
    href: "/Admin-members",
    color: "text-blue-700",
    hoverColor: "hover:bg-blue-50",
    iconBg: "bg-blue-100",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        />
        <circle cx="9" cy="7" r="4" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M23 21v-2a4 4 0 0 0-3-3.87"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 3.13a4 4 0 0 1 0 7.75"
        />
      </svg>
    ),
  },
  {
    label: "Hire Requests",
    description: "View inquiries",
    href: "/hire-requests",
    color: "text-orange-700",
    hoverColor: "hover:bg-orange-50",
    iconBg: "bg-orange-100",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="12" y1="10" x2="12" y2="10.5" />
      </svg>
    ),
  },
];

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Quick Actions</h3>
          <p className="text-xs text-gray-400 mt-0.5">Common admin tasks</p>
        </div>
        <div className="p-2 bg-gray-100 rounded-xl">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ACTIONS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={`
              group flex flex-col items-center gap-2 p-3.5 rounded-xl border border-transparent
              hover:border-gray-200 ${action.hoverColor}
              transition-all duration-200 hover:shadow-sm cursor-pointer
              text-center
            `}
          >
            <div
              className={`w-10 h-10 rounded-xl ${action.iconBg} ${action.color} flex items-center justify-center
                group-hover:scale-110 transition-transform duration-200`}
            >
              {action.icon}
            </div>
            <div>
              <p className={`text-xs font-semibold ${action.color}`}>
                {action.label}
              </p>
              <p className="text-xs text-gray-400 leading-tight mt-0.5">
                {action.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
