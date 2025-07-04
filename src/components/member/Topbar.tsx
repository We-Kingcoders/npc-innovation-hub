import React from "react";

export const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6 px-10">
      <div className="w-[540px]">
        <div className="bg-white rounded-xl shadow-md flex items-center px-6 py-3">
          <svg
            className="mr-2"
            width={24}
            height={24}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx={11} cy={11} r={8} stroke="currentColor" />
            <line x1={21} y1={21} x2={16.65} y2={16.65} stroke="currentColor" />
          </svg>
          <input
            className="w-full outline-none border-none bg-transparent"
            placeholder="Search a resource or project"
          />
        </div>
      </div>
      <div className="flex gap-8 items-center">
        <button>
          <span className="inline-block">
            <svg
              width={26}
              height={26}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M13 23c1.65 0 3-1.35 3-3H10c0 1.65 1.35 3 3 3Z" />
              <path d="M18 17V11c0-3.07-1.64-5.64-5-6.32V4a2 2 0 1 0-4 0v.68C7.64 5.36 6 7.92 6 11v6l-2 2v1h16v-1l-2-2Z" />
            </svg>
          </span>
        </button>
        <button>
          <span className="inline-block">
            <svg
              width={26}
              height={26}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x={4} y={4} width={18} height={18} rx={4} />
              <path d="M8 12h8M8 16h4" />
            </svg>
          </span>
        </button>
        <button>
          <span className="inline-block">
            <svg
              width={26}
              height={26}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx={13} cy={9} r={4} />
              <path d="M4 22c0-2.21 3.58-4 8-4s8 1.79 8 4" />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
};
