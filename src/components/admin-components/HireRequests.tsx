import { useState } from "react";
import { hireRequests } from "../../data/admin-data/HireRequest";

const PAGE_SIZE = 5;

export default function HireRequests() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(hireRequests.length / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pageRequests = hireRequests.slice(startIdx, endIdx);

  return (
    <div className="mt-6">
      {pageRequests.map((req) => (
        <div
          key={req.id}
          className="flex bg-white rounded-xl shadow p-6 items-center mb-6 border"
        >
          <img
            src={req.imageUrl}
            className="w-16 h-16 rounded-full object-cover mr-6"
            alt="avatar"
          />
          <div className="flex-1">
            <div className="font-semibold text-lg">{req.title}</div>
            <div className="text-gray-500">{req.message}</div>
            <div className="text-gray-400 text-sm mt-1">{req.time}</div>
          </div>
          <button>
            <svg width="24" height="24" fill="none">
              <circle cx="12" cy="6" r="2" fill="#444" />
              <circle cx="12" cy="12" r="2" fill="#444" />
              <circle cx="12" cy="18" r="2" fill="#444" />
            </svg>
          </button>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 mt-8">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
