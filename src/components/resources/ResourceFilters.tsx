// src/components/resources/ResourceFilters.tsx

import React from "react";
import { Search } from "lucide-react";
import type { ResourceFilterState } from "../../types/resource.types";
import { ResourceCategory, ResourceType } from "../../types/resource.types";

interface ResourceFiltersProps {
  filters: ResourceFilterState;
  onChange: (filters: ResourceFilterState) => void;
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  filters,
  onChange,
}) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, category: e.target.value });
  };

  const handleType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, type: e.target.value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search resources..."
          value={filters.search}
          onChange={handleSearch}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
        />
      </div>

      {/* Category */}
      <select
        value={filters.category}
        onChange={handleCategory}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white"
      >
        <option value="">All Categories</option>
        {Object.values(ResourceCategory).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Type */}
      <select
        value={filters.type}
        onChange={handleType}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white"
      >
        <option value="">All Types</option>
        {Object.values(ResourceType).map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ResourceFilters;
