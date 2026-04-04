// src/components/events/EventSkeleton.tsx

import React from "react";

const EventSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white shadow-md overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-8">
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-4 bg-gray-100 rounded w-24" />
        </div>
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
      </div>
    </div>
  );
};

export default EventSkeleton;
