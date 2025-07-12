import { resourceList } from "../../data/admin-data/resources";

export default function ResourceTable() {
  return (
    <div className="mt-6 bg-white shadow rounded-xl p-0 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#2d3155] text-white rounded-t-xl">
            <th className="py-4 px-6">Date</th>
            <th className="py-4 px-6">Time</th>
            <th className="py-4 px-6">Title</th>
            <th className="py-4 px-6">category</th>
            <th className="py-4 px-6">Action</th>
          </tr>
        </thead>
        <tbody>
          {resourceList.map((r, idx) => (
            <tr key={idx} className="border-b last:border-b-0 bg-gray-100">
              <td className="py-4 px-6">{r.date}</td>
              <td className="py-4 px-6">{r.time}</td>
              <td className="py-4 px-6">{r.title}</td>
              <td className="py-4 px-6">{r.category}</td>
              <td className="py-4 px-6">
                <button>
                  <svg width="24" height="24" fill="none">
                    <circle cx="12" cy="6" r="2" fill="#444" />
                    <circle cx="12" cy="12" r="2" fill="#444" />
                    <circle cx="12" cy="18" r="2" fill="#444" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Pagination */}
        <div className="flex gap-2">
          <button className="px-2 py-1 rounded bg-gray-200">&lt;</button>
          <button className="px-2 py-1 rounded bg-gray-200">1</button>
          <button className="px-2 py-1 rounded bg-gray-200">2</button>
          <button className="px-2 py-1 rounded bg-blue-400 text-white">
            3
          </button>
          <button className="px-2 py-1 rounded bg-gray-200">4</button>
          <span>...</span>
          <button className="px-2 py-1 rounded bg-gray-200">&gt;</button>
        </div>
        <button className="bg-[#2d3155] text-white px-6 py-2 rounded-lg">
          Add new resource
        </button>
      </div>
    </div>
  );
}
