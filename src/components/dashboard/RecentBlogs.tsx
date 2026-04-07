// src/components/dashboard/RecentBlogs.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Blog } from "../../types/blog.types";

interface RecentBlogsProps {
  blogs: Blog[];
  loading: boolean;
}

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "Front-end":
      return "bg-pink-100 text-pink-700";
    case "Back-end":
      return "bg-blue-100 text-blue-700";
    case "Cyber security":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RecentBlogs: React.FC<RecentBlogsProps> = ({ blogs, loading }) => {
  const navigate = useNavigate();
  const displayed = blogs.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-gray-900">Recent Articles</h3>
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-1 text-xs text-indigo-600
                     hover:text-indigo-800 font-semibold transition-colors"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1.5" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-gray-400 gap-2">
          <BookOpen size={28} className="opacity-30" />
          <p className="text-sm">No articles yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((blog) => (
            <div
              key={blog.id}
              className="flex gap-3 p-2 rounded-xl hover:bg-gray-50
                         transition-colors cursor-pointer"
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={16} className="text-gray-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                  {blog.title}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-1.5">
                  {blog.summary}
                </p>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                                  ${getCategoryColor(blog.category)}`}
                >
                  {blog.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentBlogs;
