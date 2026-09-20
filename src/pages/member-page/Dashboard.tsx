// src/pages/member-page/Dashboard.tsx

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import { useBlogs } from "../../hooks/useBlogs";
import { useResources } from "../../hooks/useResources";
import { useMemberProjects } from "../../hooks/useMemberProjects";

// Dashboard components
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardSkeleton from "../../components/dashboard/DashboardSkeleton";
import StatsCards from "../../components/dashboard/StatsCards";
import TaskOverview from "../../components/dashboard/TaskOverview";
import RecentTasks from "../../components/dashboard/RecentTasks";
import RecentProjects from "../../components/dashboard/RecentProjects";
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
    <div className="min-h-screen bg-mist-100 p-6">
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

        {/* Right: 1 col. Profile access lives in Topbar's profile dropdown
            (see Topbar.tsx) - a dashboard-widget copy of the same name/
            role/email was a plain duplicate, and Admin's own dashboard
            has no profile card either. */}
        <div className="flex flex-col gap-5">
          <TaskOverview tasks={tasks} />
          <QuickActions />
        </div>
      </div>

      {/* ── Activity feed full width ──
          Resources/Blogs/Messages preview widgets used to sit in a row
          above this - dropped since Admin's dashboard has no equivalent
          content-preview widgets at all (Resources/Blog already have
          their own full pages in the sidebar), and the messages one
          added nothing a live unread badge on Topbar's Mail icon
          doesn't already cover. */}
      <ActivityFeed tasks={tasks} blogs={blogs} resources={resources} />
    </div>
  );
};
