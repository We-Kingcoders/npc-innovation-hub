// src/components/dashboard/RecentResources.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ThumbsUp, FileText } from "lucide-react";
import type { Resource } from "../../types/resource.types";

interface RecentResourcesProps {
  resources: Resource[];
  loading: boolean;
}

const getCategoryColor = (cat: string) => {
  switch (cat) {
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

const RecentResources: React.FC<RecentResourcesProps> = ({
  resources,
  loading,
}) => {
  const navigate = useNavigate();
  const displayed = resources.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-gray-900">Recent Resources</h3>
        <button
          onClick={() => navigate("/dashboard/resources")}
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
              <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No resources available.
        </p>
      ) : (
        <div className="space-y-3">
          {displayed.map((res) => (
            <div
              key={res.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50
                         transition-colors cursor-pointer"
              onClick={() => navigate("/dashboard/resources")}
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {res.imageUrl ? (
                  <img
                    src={res.imageUrl}
                    alt={res.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={16} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                  {res.title}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                                    ${getCategoryColor(res.category)}`}
                  >
                    {res.category}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                    <ThumbsUp size={10} /> {res.upvotes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentResources;
