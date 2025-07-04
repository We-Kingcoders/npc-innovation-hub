import React from "react";

const resources = [
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
  { name: "Music festival management", date: "14/05/2025" },
];

export const ResourceTable: React.FC = () => (
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
        {resources.map((resource, idx) => (
          <tr
            key={idx}
            className="border-b border-[#C1BABA] last:border-b-0 bg-[#E5E6EB]"
          >
            <td className="py-4 px-8">{resource.name}</td>
            <td className="py-4 px-8">{resource.date}</td>
            <td className="py-4 px-8">
              <button className="text-2xl text-gray-700">⋮</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
