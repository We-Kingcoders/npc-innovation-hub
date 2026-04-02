// src/components/resources/ResourceTable.tsx

import React from "react";
import { Eye, Download, FileText, Video, BookOpen } from "lucide-react";
import type { Resource } from "../../types/resource.types";
import ResourceSkeleton from "./ResourceSkeleton";
import UpvoteButton from "./UpvoteButton";
import SaveButton from "./SaveButton";

interface ResourceTableProps {
  resources: Resource[];
  loading: boolean;
  savedResourceIds: Set<string>;
  upvotedResourceIds: Set<string>;
  onView: (resource: Resource) => void;
  onUpvote: (id: string) => Promise<void>;
  onSave: (id: string) => Promise<void>;
  /** Pass false for public pages where auth actions are hidden */
  showAuthActions?: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Video size={16} className="text-red-500" />;
    case "Book":
      return <BookOpen size={16} className="text-blue-500" />;
    case "Documentation":
      return <FileText size={16} className="text-purple-500" />;
    default:
      return <FileText size={16} className="text-gray-500" />;
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Frontend":
      return "bg-pink-100 text-pink-700";
    case "Backend":
      return "bg-blue-100 text-blue-700";
    case "Cybersecurity":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  loading,
  savedResourceIds,
  upvotedResourceIds,
  onView,
  onUpvote,
  onSave,
  showAuthActions = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Resource Library</h2>
        <p className="text-slate-300 text-sm mt-1">
          Browse resources and documents from the hub
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <ResourceSkeleton />
            ) : resources.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <FileText size={36} className="opacity-40" />
                    <p className="text-sm font-medium">No resources found</p>
                    <p className="text-xs">
                      Try adjusting your filters or check back later.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              resources.map((resource) => (
                <tr
                  key={resource.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Title + thumbnail */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {resource.imageUrl ? (
                        <img
                          src={resource.imageUrl}
                          alt={resource.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          {getTypeIcon(resource.type)}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {resource.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {resource.author}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}
                    >
                      {resource.category}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {getTypeIcon(resource.type)}
                      {resource.type}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(resource.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-1">
                      {/* View - always visible */}
                      <button
                        onClick={() => onView(resource)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors p-1 rounded-md hover:bg-indigo-50"
                        title="View Resource"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Auth-only actions */}
                      {showAuthActions && (
                        <>
                          <UpvoteButton
                            resourceId={resource.id}
                            upvotes={resource.upvotes}
                            hasUpvoted={upvotedResourceIds.has(resource.id)}
                            onUpvote={onUpvote}
                            compact
                          />
                          <SaveButton
                            resourceId={resource.id}
                            hasSaved={savedResourceIds.has(resource.id)}
                            onSave={onSave}
                            compact
                          />
                        </>
                      )}

                      {/* Download - always visible */}
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded-md hover:bg-green-50"
                          title="Open / Download"
                        >
                          <Download size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!loading && resources.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {resources.length} resource
            {resources.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceTable;
