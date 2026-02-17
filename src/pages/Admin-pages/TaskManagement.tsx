/**
 * TaskManagement Page
 * Admin page for task management
 */

import { useState, useEffect } from "react";
import Sidebar from "../../components/admin-components/Sidebar";
import Topbar from "../../components/admin-components/Topbar";
import { TaskStats } from "../../components/admin-components/TaskStats";
import TasksTable from "../../components/admin-components/TasksTable";
import { TaskFormModal } from "../../components/admin-components/TaskFormModal";
import { useTasks } from "../../hooks/useTasks";
import { Toast, useToast } from "../../components/admin-components/Toast";
import apiClient from "../../api/client";
import type { User } from "../../types/task.types";

export default function TaskManagement() {
  const { tasks, error, fetchTasks, handleCreateTask } = useTasks();
  const { toast, showToast, hideToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<User[]>([]);

  // Fetch tasks and members on mount
  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [fetchTasks]);

  const fetchMembers = async () => {
    try {
      // Adjust this endpoint to match your backend
      const response = await apiClient.get("/members");
      // Fix: Handle the response data correctly with proper typing
      const membersData = response.data as User[] | { data: User[] } | unknown;

      // Check if data is an array
      if (Array.isArray(membersData)) {
        setMembers(membersData);
      } else if (
        membersData &&
        typeof membersData === "object" &&
        "data" in membersData
      ) {
        // If data is nested in a 'data' property
        const nestedData = (membersData as { data: unknown }).data;
        if (Array.isArray(nestedData)) {
          setMembers(nestedData);
        } else {
          setMembers([]);
        }
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers([]);
    }
  };

  const handleCreate = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    const success = await handleCreateTask({
      title: data.title,
      description: data.description,
      status: data.status as "pending" | "in-progress" | "completed",
      priority: data.priority as "low" | "medium" | "high",
      dueDate: data.dueDate,
      githubIssueLink: data.githubIssueLink,
      assignedTo: data.assignedTo,
    });

    if (success) {
      setIsCreateModalOpen(false);
      showToast("Task created successfully!", "success");
    } else {
      showToast(error || "Failed to create task", "error");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <Topbar />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-3xl text-gray-900 mb-2">
                Task Management
              </h1>
              <p className="text-gray-600">Manage and track internal tasks</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
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
              Create Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Table */}
        <TasksTable members={members} />

        {/* Create Modal */}
        <TaskFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          isLoading={isSubmitting}
          members={members}
        />

        {/* Toast */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </main>
    </div>
  );
}
