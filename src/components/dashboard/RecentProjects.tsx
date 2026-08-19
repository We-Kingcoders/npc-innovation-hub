// src/components/dashboard/RecentProjects.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FolderOpen } from "lucide-react";
import type { MemberProject } from "../../api/member/project.api";

interface RecentProjectsProps {
  projects: MemberProject[];
  loading: boolean;
}

const getStatusStyle = (status?: string) => {
  switch (status) {
    case "active":
      return "bg-navy-800 text-white";
    case "review":
      return "bg-navy-100 text-navy-800";
    case "planning":
      return "bg-navy-50 text-navy-700";
    case "completed":
      return "bg-mist-200 text-mist-600";
    default:
      return "bg-navy-100 text-navy-800";
  }
};

// Derive a pseudo-progress from the project (real field not in API; use 100 for defaults)
const getProgress = (p: MemberProject): number => {
  // No progress field in API — derive visually from updatedAt recency
  const daysSince = (Date.now() - new Date(p.updatedAt).getTime()) / 86400000;
  if (daysSince < 1) return 85;
  if (daysSince < 7) return 60;
  if (daysSince < 30) return 40;
  return 20;
};

const RecentProjects: React.FC<RecentProjectsProps> = ({
  projects,
  loading,
}) => {
  const navigate = useNavigate();
  const displayed = projects.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mist-300 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-navy-800">Recent Projects</h3>
        <button
          onClick={() => navigate("/dashboard/projects")}
          className="flex items-center gap-1 text-xs text-navy-600
                     hover:text-navy-800 font-semibold transition-colors"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3">
              <div className="w-10 h-10 bg-mist-300 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-mist-300 rounded w-2/3 mb-2" />
                <div className="h-2 bg-mist-200 rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-mist-500 gap-2">
          <FolderOpen size={32} className="text-mist-400" />
          <p className="text-sm">No projects yet.</p>
          <button
            onClick={() => navigate("/dashboard/projects/new")}
            className="text-xs text-navy-600 hover:underline font-medium"
          >
            Create your first project →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((project) => {
            const progress = getProgress(project);
            return (
              <div
                key={project.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-mist-100
                           transition-colors cursor-pointer"
                onClick={() => navigate("/dashboard/projects")}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-800
                                rounded-lg flex items-center justify-center shrink-0"
                >
                  <FolderOpen size={18} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-navy-800 truncate pr-2">
                      {project.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0
                                      ${getStatusStyle()}`}
                    >
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-mist-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-navy-500 to-navy-800
                                   transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-mist-500 shrink-0">
                      {progress}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
