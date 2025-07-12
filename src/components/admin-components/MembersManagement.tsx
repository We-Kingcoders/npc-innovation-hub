import { useState } from "react";

interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

const allMembers: Member[] = [
  {
    id: "1",
    name: "Costa GASANA",
    email: "costagasana@gmail.com",
    avatarUrl: "/avatar1.jpg",
  },
  {
    id: "2",
    name: "Costa GASANA",
    email: "costagasana@gmail.com",
    avatarUrl: "/avatar1.jpg",
  },
  {
    id: "3",
    name: "Costa GASANA",
    email: "costagasana@gmail.com",
    avatarUrl: "/avatar1.jpg",
  },
  {
    id: "4",
    name: "Costa GASANA",
    email: "costagasana@gmail.com",
    avatarUrl: "/avatar1.jpg",
  },
  {
    id: "5",
    name: "Costa GASANA",
    email: "costagasana@gmail.com",
    avatarUrl: "/avatar1.jpg",
  },
  {
    id: "6",
    name: "Costa GASANA",
    email: "costagasana@gmail.com",
    avatarUrl: "/avatar1.jpg",
  },
  {
    id: "7",
    name: "Costa GASANA",
    email: "costagasana@gmail.com",
    avatarUrl: "/assets/images/hero.png",
  },
  {
    id: "8",
    name: "Costa GASANA",
    email: "costagasana@gmail.com",
    avatarUrl: "/avatar1.jpg",
  },
];

const PAGE_SIZE = 4;

export default function MembersManagement() {
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(allMembers.length / PAGE_SIZE);

  const pagedMembers = allMembers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handlePageChange = (p: number) => {
    if (p < 1 || p > pageCount) return;
    setPage(p);
  };

  return (
    <div className="flex-1 px-8 py-6">
      <h2 className="text-3xl font-bold mb-8">Members management</h2>
      <div className="flex flex-col gap-6">
        {pagedMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-6 border rounded-lg px-8 py-4 bg-white"
          >
            <img
              src={member.avatarUrl}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="flex-1">
              <div className="text-xl font-bold">{member.name}</div>
              <div className="text-blue-600 text-lg">{member.email}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button>
                <span className="w-2 h-2 bg-black rounded-full block"></span>
              </button>
              <button>
                <span className="w-2 h-2 bg-black rounded-full block"></span>
              </button>
              <button>
                <span className="w-2 h-2 bg-black rounded-full block"></span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8">
        <nav className="flex gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center rounded border text-[#1B2531] bg-white"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            &lt;
          </button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i + 1}
              className={`w-8 h-8 flex items-center justify-center rounded border ${page === i + 1 ? "text-white bg-[#0C2340]" : "text-[#1B2531] bg-white"}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="w-8 h-8 flex items-center justify-center rounded border text-[#1B2531] bg-white"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pageCount}
          >
            &gt;
          </button>
        </nav>
      </div>
    </div>
  );
}
