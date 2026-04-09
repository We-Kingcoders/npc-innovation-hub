// src/components/tasks/TaskList.tsx

import React from "react";
import type { Task } from "../../types/task.types";
import TaskCard from "./TaskCard";
import { ClipboardList } from "lucide-react";

// ── Skeleton ──
const TaskCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 animate-pulse">
    <div className="flex gap-2">
      <div className="h-5 w-20 bg-gray-200 rounded-full" />
      <div className="h-5 w-14 bg-gray-100 rounded-full" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-100 rounded w-full" />
    <div className="h-3 bg-gray-100 rounded w-5/6" />
    <div className="h-3 bg-gray-100 rounded w-1/3 mt-1" />
    <div className="h-8 bg-gray-200 rounded-lg mt-2" />
  </div>
);

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <TaskCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
        <ClipboardList size={44} className="opacity-30" />
        <p className="font-semibold text-gray-500 text-base">
          No tasks assigned yet
        </p>
        <p className="text-sm text-center max-w-xs">
          Tasks assigned to you by your admin will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
