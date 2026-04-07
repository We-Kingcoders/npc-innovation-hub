// src/components/dashboard/DashboardSkeleton.tsx

import React from "react";

const Shimmer: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);

const CardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 ${className}`}
  >
    <Shimmer className="h-4 w-24 mb-4" />
    <Shimmer className="h-8 w-16 mb-2" />
    <Shimmer className="h-3 w-32" />
  </div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
    {/* Header */}
    <div className="mb-7">
      <Shimmer className="h-8 w-64 mb-2" />
      <Shimmer className="h-4 w-80" />
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {[1, 2, 3, 4].map((n) => (
        <CardSkeleton key={n} />
      ))}
    </div>

    {/* Main grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <Shimmer className="h-5 w-32 mb-5" />
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex gap-3 mb-4">
              <Shimmer className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1">
                <Shimmer className="h-4 w-3/4 mb-2" />
                <Shimmer className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <Shimmer className="h-5 w-36 mb-5" />
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3 mb-4">
              <Shimmer className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1">
                <Shimmer className="h-4 w-2/3 mb-2" />
                <Shimmer className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col items-center">
            <Shimmer className="w-20 h-20 rounded-full mb-3" />
            <Shimmer className="h-5 w-32 mb-2" />
            <Shimmer className="h-3 w-24 mb-4" />
            <Shimmer className="h-9 w-full rounded-lg" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <Shimmer className="h-5 w-28 mb-4" />
          <Shimmer className="h-4 w-full rounded-full mb-2" />
          <Shimmer className="h-3 w-20 mx-auto" />
        </div>
      </div>
    </div>

    {/* Bottom rows */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
        >
          <Shimmer className="h-32 w-full rounded-lg mb-3" />
          <Shimmer className="h-4 w-3/4 mb-2" />
          <Shimmer className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

export default DashboardSkeleton;
