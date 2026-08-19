// src/components/dashboard/RecentResources.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ThumbsUp, FileText } from "lucide-react";
import type { Resource } from "../../types/resource.types";

interface RecentResourcesProps {
  resources: Resource[];
  loading: boolean;
}

// Categories are distinguished by depth within the same dark-blue family.
const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "Frontend":
      return "bg-navy-800 text-white";
    case "Backend":
      return "bg-navy-100 text-navy-800";
    case "Cybersecurity":
      return "bg-navy-50 text-navy-700";
    default:
      return "bg-mist-200 text-mist-600";
  }
};

const RecentResources: React.FC<RecentResourcesProps> = ({
  resources,
  loading,
}) => {
  const navigate = useNavigate();
  const displayed = resources.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-mist-300 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-navy-800">Recent Resources</h3>
        <button
          onClick={() => navigate("/dashboard/resources")}
          className="flex items-center gap-1 text-xs text-navy-600
                     hover:text-navy-800 font-semibold transition-colors"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex gap-3">
              <div className="w-12 h-12 bg-mist-300 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="h-3.5 bg-mist-300 rounded w-3/4 mb-2" />
                <div className="h-3 bg-mist-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <p className="text-sm text-mist-500 text-center py-6">
          No resources available.
        </p>
      ) : (
        <div className="space-y-3">
          {displayed.map((res) => (
            <div
              key={res.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-mist-100
                         transition-colors cursor-pointer"
              onClick={() => navigate("/dashboard/resources")}
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-mist-200 shrink-0">
                {res.imageUrl ? (
                  <img
                    src={res.imageUrl}
                    alt={res.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText size={16} className="text-mist-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-800 line-clamp-1 mb-1">
                  {res.title}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                                    ${getCategoryColor(res.category)}`}
                  >
                    {res.category}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] text-mist-500">
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
