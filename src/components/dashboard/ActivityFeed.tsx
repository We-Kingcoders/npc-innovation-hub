// src/components/dashboard/ActivityFeed.tsx

import React, { useMemo } from "react";
import {
  CheckCircle,
  Clock,
  BookOpen,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import type { Task } from "../../types/task.types";
import type { Blog } from "../../types/blog.types";
import type { Resource } from "../../types/resource.types";
import { isTaskOverdue } from "../../types/task.types";

interface ActivityFeedProps {
  tasks: Task[];
  blogs: Blog[];
  resources: Resource[];
}

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  iconBg: string;
  text: string;
  time: string;
  timestamp: number;
}

const timeAgo = (iso: string): string => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  tasks,
  blogs,
  resources,
}) => {
  const feed = useMemo((): ActivityItem[] => {
    const items: ActivityItem[] = [];

    // Tasks
    tasks.slice(0, 4).forEach((t) => {
      const overdue = isTaskOverdue(t.dueDate, t.status);
      items.push({
        id: `task-${t.id}`,
        icon: overdue ? (
          <AlertTriangle size={14} />
        ) : t.status === "completed" ? (
          <CheckCircle size={14} />
        ) : (
          <Clock size={14} />
        ),
        iconBg: overdue
          ? "bg-red-100 text-red-600"
          : t.status === "completed"
            ? "bg-green-100 text-green-600"
            : "bg-yellow-100 text-yellow-600",
        text: overdue
          ? `Overdue task: "${t.title}"`
          : `Task "${t.title}" is ${t.status}`,
        time: timeAgo(t.updatedAt),
        timestamp: new Date(t.updatedAt).getTime(),
      });
    });

    // Blogs
    blogs.slice(0, 2).forEach((b) => {
      items.push({
        id: `blog-${b.id}`,
        icon: <BookOpen size={14} />,
        iconBg: "bg-pink-100 text-pink-600",
        text: `New article published: "${b.title}"`,
        time: timeAgo(b.createdAt),
        timestamp: new Date(b.createdAt).getTime(),
      });
    });

    // Resources
    resources.slice(0, 2).forEach((r) => {
      items.push({
        id: `res-${r.id}`,
        icon: <FolderOpen size={14} />,
        iconBg: "bg-blue-100 text-blue-600",
        text: `Resource added: "${r.title}"`,
        time: timeAgo(r.createdAt),
        timestamp: new Date(r.createdAt).getTime(),
      });
    });

    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  }, [tasks, blogs, resources]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-gray-900 mb-5">Activity Feed</h3>

      {feed.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No recent activity.
        </p>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />

          <div className="space-y-4 pl-10">
            {feed.map((item) => (
              <div key={item.id} className="relative flex items-start gap-3">
                {/* Dot on timeline */}
                <div
                  className={`absolute -left-[26px] w-6 h-6 rounded-full flex
                                  items-center justify-center shrink-0 ${item.iconBg}`}
                >
                  {item.icon}
                </div>

                <div
                  className="flex-1 min-w-0 bg-gray-50 rounded-xl px-3 py-2.5
                                border border-gray-100"
                >
                  <p className="text-xs text-gray-700 font-medium line-clamp-1">
                    {item.text}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
