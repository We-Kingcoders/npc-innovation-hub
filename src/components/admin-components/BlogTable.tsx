const blogs = [
  {
    date: "14/05/2025",
    time: "10:24Am",
    category: "Front-end",
    title: "Html & Css",
  },
  {
    date: "14/05/2025",
    time: "10:24Am",
    category: "Front-end",
    title: "Html & Css",
  },
  {
    date: "14/05/2025",
    time: "10:24Am",
    category: "Front-end",
    title: "Html & Css",
  },
  {
    date: "14/05/2025",
    time: "10:24Am",
    category: "Front-end",
    title: "Html & Css",
  },
  {
    date: "14/05/2025",
    time: "10:24Am",
    category: "Front-end",
    title: "Html & Css",
  },
];

export default function BlogTable() {
  return (
    <div className=" ml-8 p-0">
      <div className="w-full max-w-[98%]">
        <table className="w-full bg-[#f4f6fa] rounded-t-2xl overflow-hidden">
          <thead>
            <tr className="bg-[#343a5e] text-white text-left">
              <th className="px-6 py-4 rounded-tl-2xl">Date</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">category</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4 rounded-tr-2xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, idx) => (
              <tr key={idx} className="border-b border-gray-300 bg-white">
                <td className="px-6 py-4">{blog.date}</td>
                <td className="px-6 py-4">{blog.time}</td>
                <td className="px-6 py-4">{blog.category}</td>
                <td className="px-6 py-4">{blog.title}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-2 h-2 bg-black rounded-full block" />
                    <span className="w-2 h-2 bg-black rounded-full block" />
                    <span className="w-2 h-2 bg-black rounded-full block" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-8">
          <button className="bg-[#343a5e] text-white rounded-xl px-10 py-3 font-bold text-lg shadow hover:bg-[#20253a] transition">
            Add new
          </button>
        </div>
      </div>
    </div>
  );
}
