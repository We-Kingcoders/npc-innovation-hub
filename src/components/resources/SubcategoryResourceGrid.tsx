import React from "react";
import { resources } from "./ResourceList";

interface Props {
  subcategory: string;
}

const SubcategoryResourceGrid: React.FC<Props> = ({ subcategory }) => {
  // Only show resources for this subcategory, with no duplicates by title
  const filtered = resources
    .filter((r) => r.subcategory === subcategory)
    .reduce((acc: typeof resources, curr) => {
      if (!acc.find((r) => r.title === curr.title)) acc.push(curr);
      return acc;
    }, []);

  // If empty, show placeholder
  if (filtered.length === 0) {
    return (
      <div className="text-center text-gray-500 py-20">
        No resources found for this subcategory.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {filtered.map((res) => (
        <div
          key={res.id}
          className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
        >
          <img src={res.icon} alt={res.title} className="w-24 h-24 mb-4" />
          <div className="font-medium text-center mb-2">{res.title}</div>
          <div className="flex gap-4 text-gray-500 text-sm items-center">
            <span className="flex items-center gap-1">
              <DownloadIcon />
              {res.likes}
            </span>
            <span className="flex items-center gap-1">
              <ViewIcon />
              {res.views}
            </span>
            <span className="ml-2 font-semibold text-[#1876C6]">
              {res.subcategory}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubcategoryResourceGrid;

// Dummy icons
const DownloadIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
    <path d="M20 20H4" />
  </svg>
);

const ViewIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M2 12C3.8 7.6 7.3 4.5 12 4.5s8.2 3.1 10 7.5c-1.8 4.4-5.3 7.5-10 7.5s-8.2-3.1-10-7.5z" />
  </svg>
);
