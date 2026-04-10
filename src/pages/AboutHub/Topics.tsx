// src/pages/AboutHub/Topics.tsx  (BlogDesign)

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useBlogs } from "../../hooks/useBlogs";
import BlogList from "../../components/blog/BlogList";
import FeaturedBlogs from "../../components/blog/FeaturedBlogs";
import { BLOG_CATEGORIES } from "../../types/blog.types";

const CATEGORY_ALL = "View All";

const BlogDesign: React.FC = () => {
  const {
    blogs,
    featuredBlogs,
    loading,
    error,
    fetchPublishedBlogs,
    fetchFeaturedBlogs,
  } = useBlogs();

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPublishedBlogs();
    fetchFeaturedBlogs();
  }, [fetchPublishedBlogs, fetchFeaturedBlogs]);

  const handleCategoryClick = (cat: string) => {
    if (cat === CATEGORY_ALL) {
      setActiveCategory("");
    } else {
      setActiveCategory(cat === activeCategory ? "" : cat);
    }
  };

  const isActive = (cat: string) => {
    if (cat === CATEGORY_ALL) return activeCategory === "";
    return activeCategory === cat;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Yellow accent bar */}
      <div className="bg-yellow-400 h-20 w-full" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
            <span className="text-sm text-gray-400">
              {blogs.length} article{blogs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search for articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent
                         bg-white transition"
            />
          </div>
        </div>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[...BLOG_CATEGORIES, CATEGORY_ALL].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                isActive(cat)
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error banner */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Featured section (only when no filters active) */}
        {!activeCategory && !search && featuredBlogs.length > 0 && (
          <FeaturedBlogs blogs={featuredBlogs} />
        )}

        {/* Section heading */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeCategory ? activeCategory : "All Articles"}
          </h2>
        </div>

        {/* Blog grid */}
        <BlogList
          blogs={blogs}
          loading={loading}
          search={search}
          activeCategory={activeCategory}
        />
      </div>
    </div>
  );
};

export default BlogDesign;
