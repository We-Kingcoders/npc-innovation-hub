/**
 * ProjectsTable Component
 * Modern admin table for project management
 */
import React from "react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import type { Project } from "../../types/project.types";
import { useProjects } from "../../hooks/useProjects";
import { ProjectFormModal } from "./ProjectFormModal";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Toast, useToast } from "./Toast";

export default function ProjectsTable() {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
  } = useProjects();

  const { toast, showToast, hideToast } = useToast();
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter projects
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleActionMenu = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActionMenuId(actionMenuId === projectId ? null : projectId);
  };

  // Handle create
  const handleCreate = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    const success = await handleCreateProject({
      title: data.title,
      description: data.description,
      image: data.image,
      link: data.link,
      demo: data.demo,
    });

    if (success) {
      setIsCreateModalOpen(false);
      showToast("Project created successfully!", "success");
    } else {
      showToast(error || "Failed to create project", "error");
    }
    setIsSubmitting(false);
  };

  // Handle edit
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
    setActionMenuId(null);
  };

  const handleUpdate = async (data: Record<string, string>) => {
    if (!selectedProject) return;

    setIsSubmitting(true);
    const success = await handleUpdateProject(selectedProject.id, {
      title: data.title,
      description: data.description,
      image: data.image,
      link: data.link,
      demo: data.demo,
    });

    if (success) {
      setIsEditModalOpen(false);
      setSelectedProject(null);
      showToast("Project updated successfully!", "success");
    } else {
      showToast(error || "Failed to update project", "error");
    }
    setIsSubmitting(false);
  };

  // Handle view details
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
    setActionMenuId(null);
  };

  // Handle delete
  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
    setActionMenuId(null);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;

    setIsSubmitting(true);
    const success = await handleDeleteProject(selectedProject.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedProject(null);
      showToast("Project deleted successfully!", "success");
    } else {
      showToast(error || "Failed to delete project", "error");
    }
    setIsSubmitting(false);
  };

  // Skeleton loader
  if (loading && projects.length === 0) {
    return (
      <div className="ml-8 p-0">
        <div className="w-full max-w-[98%]">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-2xl" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-8 p-0">
      <div className="w-full max-w-[98%]">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search projects by title, description, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center mb-6">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by creating your first project"}
            </p>
          </div>
        )}

        {/* Projects Table */}
        {filteredProjects.length > 0 && (
          <table className="w-full bg-[#f4f6fa] rounded-t-2xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-[#343a5e] text-white text-left">
                <th className="px-6 py-4 rounded-tl-2xl">Project</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* Project Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200";
                        }}
                      />
                      <div className="max-w-md">
                        <p className="font-semibold text-gray-900 truncate">
                          {project.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
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
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://randomuser.me/api/portraits/lego/1.jpg";
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {project.owner}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.ownerRole}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 text-gray-600">
                    {format(new Date(project.createdAt), "MMM dd, yyyy")}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={(e) => toggleActionMenu(project.id, e)}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                      <span className="w-1.5 h-1.5 bg-black rounded-full block" />
                    </button>

                    {/* Action Menu */}
                    {actionMenuId === project.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-10"
                      >
                        <button
                          onClick={() => handleViewDetails(project)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleDeleteClick(project)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add New Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#343a5e] text-white rounded-xl px-10 py-3 font-bold text-lg shadow hover:bg-[#20253a] transition-all flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Project
          </button>
        </div>
      </div>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleUpdate}
        initialData={selectedProject}
        isLoading={isSubmitting}
      />

      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedProject(null);
        }}
        isLoading={isSubmitting}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
