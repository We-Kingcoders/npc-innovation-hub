import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const projects = [
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
];

export const ProjectTable: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-[#28335A] text-white">
        <tr>
          <th className="py-4 px-6 text-left text-base font-semibold">
            Project Name
          </th>
          <th className="py-4 px-6 text-left text-base font-semibold">Date</th>
          <th className="py-4 px-6 text-left text-base font-semibold">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, idx) => (
          <tr
            key={idx}
            className="border-b border-gray-200 bg-[#F9FAFB] hover:bg-[#F1F5F9] transition"
          >
            <td className="py-4 px-6">{project.name}</td>
            <td className="py-4 px-6">{project.date}</td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-4">
                <button
                  title="View"
                  className="text-green-600 hover:text-green-800 transition"
                >
                  <Eye size={18} />
                </button>
                <button
                  title="Edit"
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Pencil size={18} />
                </button>
                <button
                  title="Delete"
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
