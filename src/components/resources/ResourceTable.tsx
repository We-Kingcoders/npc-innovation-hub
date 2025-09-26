import { Eye, Download, FileText } from "lucide-react";

const resources = [
  {
    name: "Essentials for figma beginners",
    date: "14/05/2025",
    category: "Cyber Security",
  },
  {
    name: "Event Planning Templates",
    date: "12/05/2025",
    category: "Frontend",
  },
  {
    name: "Vendor Management Checklist",
    date: "10/05/2025",
    category: "Backend",
  },
  {
    name: "Budget Planning Spreadsheet",
    date: "08/05/2025",
    category: "Cyber Security",
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Cyber Security":
      return <FileText size={16} className="text-purple-500" />;
    case "Frontend":
      return <FileText size={16} className="text-pink-500" />;
    case "Backend":
      return <FileText size={16} className="text-blue-500" />;
    default:
      return <FileText size={16} className="text-gray-500" />;
  }
};

export default function ResourceTable() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Resource Library</h2>
        <p className="text-slate-300 text-sm mt-1">
          Manage your event resources and documents
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Modified
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.map((resource, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {getCategoryIcon(resource.category)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {resource.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {resource.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {resource.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1 rounded-md hover:bg-indigo-50"
                      title="View Resource"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 transition-colors duration-200 p-1 rounded-md hover:bg-green-50"
                      title="Download Resource"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {resources.length} of {resources.length} resources
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
              1
            </button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
