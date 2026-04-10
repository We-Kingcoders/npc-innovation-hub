// src/pages/blog/BlogDetails.tsx

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Calendar, Tag } from "lucide-react";
import { useBlogs } from "../../hooks/useBlogs";

// ── Simple markdown → HTML renderer (no external deps) ──
const renderMarkdown = (md: string): string => {
  return (
    md
      // Headings
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-lg font-bold text-gray-800 mt-5 mb-2">$1</h3>',
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-xl font-bold text-gray-900 mt-7 mb-3">$1</h2>',
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-2xl font-extrabold text-gray-900 mt-8 mb-4">$1</h1>',
      )
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-6 border-gray-200" />')
      // Bold
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-gray-900">$1</strong>',
      )
      // Italic
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      // Unordered list items
      .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-gray-700">$1</li>')
      // Wrap consecutive <li> in <ul>
      .replace(
        /(<li[\s\S]*?<\/li>\n?)+/g,
        (match) => `<ul class="my-3 space-y-1">${match}</ul>`,
      )
      // Paragraphs — lines not already converted
      .replace(/^(?!<[a-z]).+$/gm, (line) =>
        line.trim()
          ? `<p class="text-gray-700 leading-relaxed">${line}</p>`
          : "",
      )
      // Double newlines → spacing
      .replace(/\n{2,}/g, '<div class="my-3"></div>')
  );
};

const getCategoryColor = (category: string): string => {
  switch (category) {
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

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedBlog,
    loading,
    error,
    fetchPublicBlogById,
    clearSelectedBlog,
  } = useBlogs();

  useEffect(() => {
    if (id) fetchPublicBlogById(id);
    return () => clearSelectedBlog();
  }, [id, fetchPublicBlogById, clearSelectedBlog]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-64 bg-gray-200 animate-pulse w-full" />
        <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-5">
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !selectedBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-lg font-semibold">
          {error || "Blog post not found."}
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-[#1876C6] hover:underline text-sm"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </button>
      </div>
    );
  }

  const htmlContent = renderMarkdown(selectedBlog.content);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden bg-gray-200">
        {selectedBlog.image && (
          <img
            src={selectedBlog.image}
            alt={selectedBlog.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/blog")}
          className="absolute top-5 left-5 flex items-center gap-2 text-white bg-black/30
                     backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium
                     hover:bg-black/50 transition"
        >
          <ArrowLeft size={15} />
          Back to Blog
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 max-w-3xl mx-auto">
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${getCategoryColor(selectedBlog.category)}`}
          >
            {selectedBlog.category}
          </span>
          <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight">
            {selectedBlog.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-400" />
            {formatDate(selectedBlog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} className="text-gray-400" />
            {selectedBlog.viewCount} views
          </span>
          <span className="flex items-center gap-1.5">
            <Tag size={14} className="text-gray-400" />
            {selectedBlog.category}
          </span>
        </div>

        {/* Summary */}
        <p className="text-gray-600 text-base leading-relaxed mb-8 p-4 bg-blue-50 border-l-4 border-[#1876C6] rounded-r-lg italic">
          {selectedBlog.summary}
        </p>

        {/* Markdown content */}
        <div
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Bottom nav */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-[#1876C6] hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
