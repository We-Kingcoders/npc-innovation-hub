// src/components/dashboard/QuickActions.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList, BookOpen, FolderOpen } from "lucide-react";

interface Action {
  label: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  path: string;
}

const ACTIONS: Action[] = [
  {
    label: "Add Project",
    sub: "Create a new project",
    icon: <Plus size={20} />,
    iconBg: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200",
    path: "/dashboard/projects/new",
  },
  {
    label: "My Tasks",
    sub: "View assigned tasks",
    icon: <ClipboardList size={20} />,
    iconBg: "bg-blue-100 text-blue-600 group-hover:bg-blue-200",
    path: "/dashboard/tasks",
  },
  {
    label: "Resources",
    sub: "Browse the library",
    icon: <FolderOpen size={20} />,
    iconBg: "bg-green-100 text-green-600 group-hover:bg-green-200",
    path: "/dashboard/resources",
  },
  {
    label: "Blog",
    sub: "Read latest articles",
    icon: <BookOpen size={20} />,
    iconBg: "bg-pink-100 text-pink-600 group-hover:bg-pink-200",
    path: "/blog",
  },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="group flex flex-col items-center text-center p-4 rounded-xl
                       border border-gray-100 hover:border-indigo-200
                       hover:shadow-md transition-all duration-200"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center
                             mb-2.5 transition-colors duration-200 ${action.iconBg}`}
            >
              {action.icon}
            </div>
            <span className="text-xs font-bold text-gray-900">
              {action.label}
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">
              {action.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
