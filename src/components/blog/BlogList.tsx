// src/components/blog/BlogList.tsx

import React, { useMemo } from "react";
import type { Blog } from "../../types/blog.types";
import BlogCard from "./BlogCard";
import { BlogSkeletonGrid } from "./BlogSkeleton";
import { BookOpen } from "lucide-react";

interface BlogListProps {
  blogs: Blog[];
  loading: boolean;
  search: string;
  activeCategory: string;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  loading,
  search,
  activeCategory,
}) => {
  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCategory = !activeCategory || b.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, search, activeCategory]);

  if (loading) return <BlogSkeletonGrid count={6} />;

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400 gap-3">
        <BookOpen size={40} className="opacity-40" />
        <p className="font-semibold text-gray-500">No articles found</p>
        <p className="text-sm">Try a different category or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
