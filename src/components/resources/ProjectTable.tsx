// import React from "react";
import { Eye, Pencil, Trash2, Calendar, Clock } from "lucide-react";

const projects = [
  {
    name: "Coachella Music Festival 2025",
    date: "14/05/2025",
    status: "Active",
    progress: 85,
    category: "Music Festival",
  },
  {
    name: "Corporate Event Planning",
    date: "12/05/2025",
    status: "In Progress",
    progress: 62,
    category: "Corporate",
  },
  {
    name: "Wedding Ceremony Management",
    date: "10/05/2025",
    status: "Planning",
    progress: 35,
    category: "Wedding",
  },
  {
    name: "Tech Conference 2025",
    date: "08/05/2025",
    status: "Completed",
    progress: 100,
    category: "Conference",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Planning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Completed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 30) return "bg-yellow-500";
  return "bg-red-500";
};

export default function ProjectTable() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-blue-950  px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Project Dashboard</h2>
        <p className="text-indigo-100 text-sm mt-1">
          Manage and track your event projects
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Active: 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">In Progress: 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Planning: 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600">Completed: 1</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {project.name}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block w-fit">
                      {project.category}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(project.progress)} transition-all duration-500`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-1" />
                    {project.date}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      title="View project"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200 group"
                    >
                      <Eye
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </button>
                    <button
                      title="Edit project"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group"
                    >
                      <Pencil
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </button>
                    <button
                      title="Delete project"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 group"
                    >
                      <Trash2
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {projects.length} of {projects.length} projects
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>Last updated: 2 minutes ago</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200">
              Previous
            </button>
            <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
              1
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
