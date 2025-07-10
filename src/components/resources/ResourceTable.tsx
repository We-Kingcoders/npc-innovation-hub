import React from "react";
import { Eye } from "lucide-react";

const resources = [
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
];

export const ResourceTable: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-[#28335A] text-white">
        <tr>
          <th className="py-4 px-6 text-left text-base font-semibold">
            Resource Name
          </th>
          <th className="py-4 px-6 text-left text-base font-semibold">Date</th>
          <th className="py-4 px-6 text-left text-base font-semibold">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {resources.map((resource, idx) => (
          <tr
            key={idx}
            className="border-b border-gray-200 bg-[#F9FAFB] hover:bg-[#F1F5F9] transition"
          >
            <td className="py-4 px-6">{resource.name}</td>
            <td className="py-4 px-6">{resource.date}</td>
            <td className="py-4 px-6">
              <button
                title="View"
                className="text-green-600 hover:text-green-800 transition"
              >
                <Eye size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
