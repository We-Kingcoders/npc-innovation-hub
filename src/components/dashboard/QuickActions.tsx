// src/components/dashboard/QuickActions.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList, BookOpen, FolderOpen } from "lucide-react";

interface Action {
  label: string;
  sub: string;
  icon: React.ReactNode;
  path: string;
}

const ACTIONS: Action[] = [
  {
    label: "Add Project",
    sub: "Create a new project",
    icon: <Plus size={20} />,
    path: "/dashboard/projects/new",
  },
  {
    label: "My Tasks",
    sub: "View assigned tasks",
    icon: <ClipboardList size={20} />,
    path: "/dashboard/tasks",
  },
  {
    label: "Resources",
    sub: "Browse the library",
    icon: <FolderOpen size={20} />,
    path: "/dashboard/resources",
  },
  {
    label: "Blog",
    sub: "Read latest articles",
    icon: <BookOpen size={20} />,
    path: "/blog",
  },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mist-300 p-5">
      <h3 className="text-sm font-bold text-navy-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="group flex flex-col items-center text-center p-4 rounded-xl
                       bg-mist-50 border border-mist-300 hover:border-navy-600
                       hover:shadow-md transition-all duration-200"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5
                         bg-navy-50 text-navy-700 transition-colors duration-200
                         group-hover:bg-navy-800 group-hover:text-white"
            >
              {action.icon}
            </div>
            <span className="text-xs font-bold text-navy-800">
              {action.label}
            </span>
            <span className="text-[10px] text-mist-500 mt-0.5">
              {action.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
