// src/pages/projects-page/Projects.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Layers,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useMemberProjects } from "../../hooks/useMemberProjects";
import ProjectTable from "../../components/resources/ProjectTable";

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    loading,
    error,
    viewMode,
    setViewMode,
    deleteProject,
    updateProject,
    searchProjects,
    refresh,
  } = useMemberProjects();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    searchProjects(val);
  };

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Browse, manage and showcase your work
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/projects/new")}
          className="inline-flex items-center gap-2 bg-[#28335A] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1e2745] transition shadow-sm shrink-0"
        >
          <Plus size={16} />
          Add New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              viewMode === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setViewMode("mine")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              viewMode === "mine"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Projects
          </button>
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search projects…"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28335A]/20 focus:border-[#28335A] transition"
            />
          </div>
          <button
            onClick={refresh}
            title="Refresh"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="text-sm">Loading projects…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 text-red-400">
          <AlertCircle size={32} className="mb-3" />
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={refresh}
            className="mt-4 text-sm text-[#28335A] hover:underline font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Layers size={40} className="mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">No projects found</p>
          <p className="text-xs text-gray-400 mt-1">
            {viewMode === "mine"
              ? "You haven't added any projects yet."
              : "No projects are available right now."}
          </p>
          {viewMode === "mine" && (
            <button
              onClick={() => navigate("/dashboard/projects/new")}
              className="mt-5 inline-flex items-center gap-2 bg-[#28335A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1e2745] transition"
            >
              <Plus size={15} />
              Add your first project
            </button>
          )}
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <ProjectTable
          projects={projects}
          onDelete={deleteProject}
          onUpdate={updateProject}
        />
      )}
    </div>
  );
};

export default Projects;
