import React from "react";

const projects = [
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
];

export const ProjectTable: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <table className="min-w-full">
      <thead>
        <tr className="bg-[#28335A] text-white">
          <th className="py-4 px-8 text-left text-lg font-medium">Name</th>
          <th className="py-4 px-8 text-left text-lg font-medium">Date</th>
          <th className="py-4 px-8 text-left text-lg font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, idx) => (
          <tr
            key={idx}
            className="border-b border-[#C1BABA] last:border-b-0 bg-[#E5E6EB]"
          >
            <td className="py-4 px-8">{project.name}</td>
            <td className="py-4 px-8">{project.date}</td>
            <td className="py-4 px-8 flex gap-4">
              <button className="text-2xl text-gray-700">
                <svg
                  width={20}
                  height={20}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <rect x={4} y={4} width={12} height={12} rx={2} />
                  <path d="M8 12h4M8 8h4" />
                </svg>
              </button>
              <button className="text-2xl text-gray-700">
                <svg
                  width={20}
                  height={20}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <rect x={6} y={6} width={8} height={8} rx={2} />
                  <path d="M9 9v4M11 9v4" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
