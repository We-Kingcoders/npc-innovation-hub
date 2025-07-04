import React, { useState } from "react";

// Mock event data
const events = [
  {
    id: 1,
    title: "Innovation hub meeting",
    location: "Auditorium , NPC",
    start: "25/09/2025, 19:00 PM",
    end: "25/09/2025, 19:00 PM",
    description:
      "Learn about new technologies, tools, best practices, and networking",
    image:
      "https://media.istockphoto.com/id/1807106085/photo/u-s-department-of-education-washington-d-c.jpg?s=612x612&w=0&k=20&c=vYTa0uAz4FKU6x2h2AW2_VSwh3BPPpG7wSRP9pV4zMQ=",
    past: false,
  },
  {
    id: 2,
    title: "Innovation hub meeting",
    location: "Auditorium , NPC",
    start: "25/09/2025, 19:00 PM",
    end: "25/09/2025, 19:00 PM",
    description:
      "Learn about new technologies, tools, best practices, and networking",
    image:
      "https://media.istockphoto.com/id/1807106085/photo/u-s-department-of-education-washington-d-c.jpg?s=612x612&w=0&k=20&c=vYTa0uAz4FKU6x2h2AW2_VSwh3BPPpG7wSRP9pV4zMQ=",
    past: false,
  },
  {
    id: 3,
    title: "Innovation hub meeting",
    location: "Auditorium , NPC",
    start: "25/09/2025, 19:00 PM",
    end: "25/09/2025, 19:00 PM",
    description:
      "Learn about new technologies, tools, best practices, and networking",
    image:
      "https://media.istockphoto.com/id/1807106085/photo/u-s-department-of-education-washington-d-c.jpg?s=612x612&w=0&k=20&c=vYTa0uAz4FKU6x2h2AW2_VSwh3BPPpG7wSRP9pV4zMQ=",
    past: false,
  },
  {
    id: 4,
    title: "Innovation hub meeting",
    location: "Auditorium , NPC",
    start: "25/09/2025, 19:00 PM",
    end: "25/09/2025, 19:00 PM",
    description:
      "Learn about new technologies, tools, best practices, and networking",
    image:
      "https://media.istockphoto.com/id/1807106085/photo/u-s-department-of-education-washington-d-c.jpg?s=612x612&w=0&k=20&c=vYTa0uAz4FKU6x2h2AW2_VSwh3BPPpG7wSRP9pV4zMQ=",
    past: false,
  },
  {
    id: 5,
    title: "Innovation hub meeting",
    location: "Auditorium , NPC",
    start: "25/09/2025, 19:00 PM",
    end: "25/09/2025, 19:00 PM",
    description:
      "Learn about new technologies, tools, best practices, and networking",
    image:
      "https://media.istockphoto.com/id/1807106085/photo/u-s-department-of-education-washington-d-c.jpg?s=612x612&w=0&k=20&c=vYTa0uAz4FKU6x2h2AW2_VSwh3BPPpG7wSRP9pV4zMQ=",
    past: false,
  },
  {
    id: 6,
    title: "Innovation hub meeting",
    location: "Auditorium , NPC",
    start: "25/09/2025, 19:00 PM",
    end: "25/09/2025, 19:00 PM",
    description:
      "Learn about new technologies, tools, best practices, and networking",
    image:
      "https://media.istockphoto.com/id/1807106085/photo/u-s-department-of-education-washington-d-c.jpg?s=612x612&w=0&k=20&c=vYTa0uAz4FKU6x2h2AW2_VSwh3BPPpG7wSRP9pV4zMQ=",
    past: false,
  },
];

export const Events: React.FC = () => {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  // For demo, all are upcoming events
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hub events</h2>
      <div className="bg-white rounded-2xl shadow-lg p-0 px-0 pb-10">
        <div className="flex gap-8 border-b px-8 pt-6">
          <button
            className={`pb-3 text-lg font-semibold border-b-2 transition ${
              tab === "upcoming"
                ? "border-black"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => setTab("upcoming")}
          >
            Upcoming events
          </button>
          <button
            className={`pb-3 text-lg font-semibold border-b-2 transition ${
              tab === "past"
                ? "border-black"
                : "border-transparent text-gray-400"
            }`}
            onClick={() => setTab("past")}
          >
            Past events
          </button>
        </div>
        <div className="px-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .filter((e) => (tab === "upcoming" ? !e.past : e.past))
              .map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl bg-white shadow-md overflow-hidden flex flex-col"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <svg
                        width={16}
                        height={16}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <circle cx={8} cy={8} r={7} />
                        <path d="M8 8v3" />
                        <path d="M8 4v1" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex gap-8 text-xs text-gray-500 mb-2">
                      <div>
                        <div className="font-semibold">Start</div>
                        <div>{event.start}</div>
                      </div>
                      <div>
                        <div className="font-semibold">End</div>
                        <div>{event.end}</div>
                      </div>
                    </div>
                    <div className="flex-1 text-gray-500 text-sm">
                      {event.description}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
