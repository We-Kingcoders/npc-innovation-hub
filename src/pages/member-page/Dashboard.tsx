// src/pages/member-page/Dashboard.tsx

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import { useBlogs } from "../../hooks/useBlogs";
import { useResources } from "../../hooks/useResources";
import { useMemberProjects } from "../../hooks/useMemberProjects";
import { useConversations } from "../../hooks/useDirectMessages";

// Dashboard components
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import StatsCards from "../../components/dashboard/StatsCards";
import ProfileCard from "../../components/dashboard/ProfileCard";
import TaskOverview from "../../components/dashboard/TaskOverview";
import RecentTasks from "../../components/dashboard/RecentTasks";
import RecentProjects from "../../components/dashboard/RecentProjects";
import RecentResources from "../../components/dashboard/RecentResources";
import RecentBlogs from "../../components/dashboard/RecentBlogs";
import MessagesPreview from "../../components/dashboard/MessagesPreview";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import QuickActions from "../../components/dashboard/QuickActions";

const REFRESH_INTERVAL = 30_000; // 30 seconds

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // ── Tasks ──────────────────────────────────────────────────────────────────
  const { tasks, loading: tasksLoading, fetchAssignedTasks } = useTasks();

  // ── Blogs ──────────────────────────────────────────────────────────────────
  const { blogs, loading: blogsLoading, fetchPublishedBlogs } = useBlogs();

  // ── Resources ──────────────────────────────────────────────────────────────
  const {
    resources,
    loading: resourcesLoading,
    fetchResources,
  } = useResources();

  // ── Projects ───────────────────────────────────────────────────────────────
  const { projects, loading: projectsLoading } = useMemberProjects();

  // ── Messages ───────────────────────────────────────────────────────────────
  const { conversations, isLoading: convsLoading } = useConversations();

  // ── Track initial load ─────────────────────────────────────────────────────
  const [initialised, setInitialised] = useState(false);
  const refreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const init = async () => {
      await Promise.allSettled([
        fetchAssignedTasks(),
        fetchPublishedBlogs(),
        fetchResources(),
      ]);
      setInitialised(true);
    };
    init();

    // Auto-refresh tasks every 30 s
    refreshRef.current = setInterval(() => {
      fetchAssignedTasks();
    }, REFRESH_INTERVAL);

    return () => {
      if (refreshRef.current) clearInterval(refreshRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show full skeleton only on very first load
  const isFirstLoad =
    !initialised && (tasksLoading || blogsLoading || resourcesLoading);

  if (isFirstLoad) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Greeting header ── */}
      <DashboardHeader user={user} />

      {/* ── Stats row ── */}
      <StatsCards tasks={tasks} />

      {/* ── Main 3-col grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RecentTasks tasks={tasks} loading={tasksLoading} />
          <RecentProjects projects={projects} loading={projectsLoading} />
        </div>

        {/* Right: 1 col */}
        <div className="flex flex-col gap-5">
          <ProfileCard user={user} />
          <TaskOverview tasks={tasks} />
          <QuickActions />
        </div>
      </div>

      {/* ── Bottom 3-col row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <RecentResources resources={resources} loading={resourcesLoading} />
        <RecentBlogs blogs={blogs} loading={blogsLoading} />
        <MessagesPreview conversations={conversations} loading={convsLoading} />
      </div>

      {/* ── Activity feed full width ── */}
      <ActivityFeed tasks={tasks} blogs={blogs} resources={resources} />
    </div>
  );
};
