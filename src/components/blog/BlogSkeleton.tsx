// src/components/blog/BlogSkeleton.tsx

import React from "react";

const BlogSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200 w-full" />
    <div className="p-5 flex flex-col gap-3">
      <div className="h-3 bg-gray-200 rounded w-20" />
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-5/6" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-3 bg-gray-100 rounded w-16" />
        <div className="h-8 bg-gray-200 rounded-lg w-24" />
      </div>
    </div>
  </div>
);

export const BlogSkeletonGrid: React.FC<{ count?: number }> = ({
  count = 6,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <BlogSkeleton key={i} />
    ))}
  </div>
);

export default BlogSkeleton;
