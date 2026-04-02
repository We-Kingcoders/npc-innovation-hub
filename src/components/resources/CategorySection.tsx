// src/components/resources/CategorySection.tsx

import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Cyber Security",
    apiCategory: "Cybersecurity",
    subcategories: [
      "Authentication & Authorization",
      "Network Security",
      "Vulnerability Management",
      "Security Tools",
      "DevSecOps",
      "Incident Response",
    ],
  },
  {
    title: "Front-End Development",
    apiCategory: "Frontend",
    subcategories: [
      "UI Libraries & Frameworks",
      "State Management",
      "Component Design",
      "Routing & Navigation",
      "Performance Optimization",
      "Testing",
    ],
  },
  {
    title: "Back-End Development",
    apiCategory: "Backend",
    subcategories: [
      "API Development",
      "Authentication",
      "Database Integration",
      "Server Frameworks",
      "DevOps & Deployment",
      "Error Handling & Logging",
      "Caching & Performance",
    ],
  },
];

const CategorySection: React.FC = () => (
  <div>
    {categories.map((cat) => (
      <div key={cat.title} className="mb-8">
        {/* Category header with "View All" link */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200" />
          <div className="flex items-center gap-3 px-4">
            <h3 className="text-lg font-semibold text-gray-800">{cat.title}</h3>
            <Link
              to={`/resources-room/all-resources?category=${encodeURIComponent(cat.apiCategory)}`}
              className="text-xs text-[#1876C6] hover:underline font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Subcategory pills — keep existing routing pattern */}
        <div className="flex flex-wrap gap-3 justify-center">
          {cat.subcategories.map((sub) => (
            <Link
              key={sub}
              to={`/resources-room/categories/${encodeURIComponent(sub)}`}
              className="px-5 py-2 bg-white border border-gray-200 rounded-full text-[#1876C6] hover:bg-blue-50 hover:border-blue-300 font-medium shadow-sm transition"
            >
              {sub}
            </Link>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default CategorySection;
