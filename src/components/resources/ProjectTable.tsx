// src/components/resources/ProjectTable.tsx
import React, { useState } from "react";
import {
  Eye,
  Trash2,
  ExternalLink,
  Github,
  Calendar,
  User,
  Pencil,
} from "lucide-react";
import type { MemberProject } from "../../api/member/project.api";
import ProjectViewModal from "./ProjectViewModal";
import ProjectDeleteModal from "./ProjectDeleteModal";
import ProjectEditModal from "./ProjectEditModal";

interface Props {
  projects: MemberProject[];
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, payload: FormData) => Promise<void>;
}

const ProjectTable: React.FC<Props> = ({ projects, onDelete, onUpdate }) => {
  const [viewProject, setViewProject] = useState<MemberProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MemberProject | null>(null);
  const [editTarget, setEditTarget] = useState<MemberProject | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await onDelete(deleteTarget.id);
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Links
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {/* Project */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#28335A]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#28335A] text-sm font-bold">
                            {project.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight">
                          {project.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={project.ownerAvatar}
                        alt={project.owner}
                        className="w-7 h-7 rounded-full border border-gray-200 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://randomuser.me/api/portraits/lego/1.jpg";
                        }}
                      />
                      <span className="text-sm text-gray-700">
                        {project.owner &&
                        project.owner !== "undefined undefined"
                          ? project.owner
                          : "—"}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        project.ownerRole === "Admin"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {project.ownerRole}
                    </span>
                  </td>

                  {/* Links */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Source Code"
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-900 text-white hover:bg-gray-700 transition"
                        >
                          <Github size={13} />
                        </a>
                      ) : (
                        <span className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-gray-300 cursor-not-allowed">
                          <Github size={13} />
                        </span>
                      )}
                      {project.demo ? (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Live Demo"
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-[#28335A] text-white hover:bg-[#1e2745] transition"
                        >
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 text-gray-300 cursor-not-allowed">
                          <ExternalLink size={13} />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={12} />
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        title="View project"
                        onClick={() => setViewProject(project)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition group"
                      >
                        <Eye
                          size={15}
                          className="group-hover:scale-110 transition-transform"
                        />
                      </button>
                      {onUpdate && (
                        <button
                          title="Edit project"
                          onClick={() => setEditTarget(project)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition group"
                        >
                          <Pencil
                            size={15}
                            className="group-hover:scale-110 transition-transform"
                          />
                        </button>
                      )}
                      <button
                        title="Delete project"
                        onClick={() => setDeleteTarget(project)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition group"
                      >
                        <Trash2
                          size={15}
                          className="group-hover:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <User size={12} />
            Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewProject && (
        <ProjectViewModal
          project={viewProject}
          onClose={() => setViewProject(null)}
        />
      )}
      {editTarget && onUpdate && (
        <ProjectEditModal
          project={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={onUpdate}
        />
      )}
      {deleteTarget && (
        <ProjectDeleteModal
          projectTitle={deleteTarget.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </>
  );
};

export default ProjectTable;
