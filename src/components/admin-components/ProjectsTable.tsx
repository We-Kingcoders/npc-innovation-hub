/**
 * ProjectsTable Component
 * Modern admin table for project management
 */
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import type { Project } from "../../types/project.types";
import { useProjects } from "../../hooks/useProjects";
import { ProjectFormModal } from "./ProjectFormModal";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Toast, useToast } from "./Toast";
import ResponsiveTable from "../ui/ResponsiveTable";
import MobileCardRow from "../ui/MobileCardRow";

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
  // Position for the portaled action menu (see toggleActionMenu/the Action
  // Menu render below) - computed from the trigger button's own on-screen
  // rect, not CSS-relative to it, so the menu can render outside this
  // table's overflow-x-auto wrapper instead of being clipped by it.
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  // Seeded from ?q= so the Topbar's search dropdown can link here with
  // the query already applied instead of landing on an unfiltered list.
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q") || "",
  );

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
    if (actionMenuId === projectId) {
      setActionMenuId(null);
      return;
    }
    // rect.bottom/right are already viewport-relative, exactly what a
    // position: fixed element needs - no scroll-offset math required.
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
    setActionMenuId(projectId);
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

  // Action menu trigger + portaled menu, shared by the desktop table row
  // and the mobile card - reused verbatim rather than reimplemented, since
  // it computes its position from the trigger button's own on-screen rect
  // (see toggleActionMenu above) and doesn't care what DOM context it's
  // triggered from.
  const renderActionMenu = (project: Project) => (
    <>
      <button
        onClick={(e) => toggleActionMenu(project.id, e)}
        className="flex flex-col items-center gap-1 p-2 hover:bg-mist-100 rounded transition-colors"
      >
        <span className="w-1.5 h-1.5 bg-navy-700 rounded-full block" />
        <span className="w-1.5 h-1.5 bg-navy-700 rounded-full block" />
        <span className="w-1.5 h-1.5 bg-navy-700 rounded-full block" />
      </button>

      {actionMenuId === project.id &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPosition.top,
              right: menuPosition.right,
            }}
            className="bg-white rounded-lg shadow-lg border border-mist-300 py-1 min-w-[160px] z-50"
          >
            <button
              onClick={() => handleViewDetails(project)}
              className="w-full px-4 py-2 text-left text-sm text-navy-800 hover:bg-mist-100 flex items-center gap-2"
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
              className="w-full px-4 py-2 text-left text-sm text-navy-800 hover:bg-mist-100 flex items-center gap-2"
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
          </div>,
          document.body,
        )}
    </>
  );

  // Skeleton loader
  if (loading && projects.length === 0) {
    return (
      <div className="p-0">
        <div className="w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-mist-200 rounded-2xl" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-mist-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-mist-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
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
              className="mx-auto h-12 w-12 text-mist-400 mb-4"
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
            <h3 className="text-lg font-medium text-navy-800 mb-2">
              No projects found
            </h3>
            <p className="text-mist-600">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by creating your first project"}
            </p>
          </div>
        )}

        {/* Projects Table. table's className has no overflow-hidden: it
            would break the sticky first column - see EventsTable.tsx. */}
        {filteredProjects.length > 0 && (
          <ResponsiveTable
            table={
              <table className="w-full bg-mist-100 rounded-t-2xl shadow-sm border-separate border-spacing-0">
                <thead>
                  <tr className="bg-navy-800 text-white text-left">
                    {/* Sticky first column - see EventsTable.tsx for why. */}
                    <th className="px-6 py-4 rounded-tl-2xl sticky left-0 z-10 bg-navy-800">
                      Project
                    </th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-mist-300 bg-white hover:bg-mist-100 transition-colors"
                    >
                      {/* Project Info */}
                      <td className="px-6 py-4 sticky left-0 z-[1] bg-white border-r border-mist-300">
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
                            <p className="font-semibold text-navy-800 truncate">
                              {project.title}
                            </p>
                            <p className="text-sm text-mist-600 truncate">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 text-mist-600">
                        {format(new Date(project.createdAt), "MMM dd, yyyy")}
                      </td>

                      {/* Actions - portaled to <body> with position: fixed
                          instead of being positioned absolute/relative to
                          this cell. The table wrapper above has
                          overflow-x-auto, and per the CSS overflow spec,
                          giving one axis a non-visible overflow value
                          forces the other axis to effectively become
                          "auto" too - so an absolutely-positioned menu on
                          the last row (or any row close to the bottom)
                          was getting its lower portion (Delete, sometimes
                          Edit too) silently clipped by that same scroll
                          container. Fixed positioning computed from the
                          trigger button's real on-screen rect (see
                          toggleActionMenu) escapes that entirely. */}
                      <td className="px-6 py-4 relative">
                        {renderActionMenu(project)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
            cards={
              <>
                {filteredProjects.map((project) => (
                  <div key={project.id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-navy-800 truncate">
                            {project.title}
                          </p>
                          <p className="text-sm text-mist-600 truncate">
                            {project.description}
                          </p>
                        </div>
                      </div>
                      {renderActionMenu(project)}
                    </div>
                    <dl className="flex flex-col gap-1">
                      <MobileCardRow label="Created">
                        {format(new Date(project.createdAt), "MMM dd, yyyy")}
                      </MobileCardRow>
                    </dl>
                  </div>
                ))}
              </>
            }
          />
        )}

        {/* Add New Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-navy-800 text-white rounded-xl px-10 py-3 font-bold text-lg shadow hover:bg-navy-700 transition-all flex items-center gap-2"
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
