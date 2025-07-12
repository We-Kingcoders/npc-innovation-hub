export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="w-[480px]">
        <div className="flex items-center bg-white shadow rounded-xl px-6 py-3">
          <svg className="text-gray-400" width="24" height="24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#333" strokeWidth="2" />
          </svg>
          <input
            className="ml-2 bg-transparent outline-none w-full"
            placeholder="Search a resource or project"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button>
          <svg width="28" height="28" fill="none">
            <path
              d="M14 4v2m0 16v2M4 14h2m16 0h2M6.34 6.34l1.42 1.42M18.36 18.36l1.42 1.42M6.34 21.66l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="#111"
              strokeWidth="2"
            />
          </svg>
        </button>
        <button>
          <svg width="28" height="28" fill="none">
            <rect
              x="4"
              y="6"
              width="20"
              height="16"
              rx="4"
              fill="#fff"
              stroke="#111"
              strokeWidth="2"
            />
          </svg>
        </button>
        <button>
          <svg width="28" height="28" fill="none">
            <circle cx="14" cy="10" r="4" stroke="#111" strokeWidth="2" />
            <path
              d="M4 24c0-4 4-8 10-8s10 4 10 8"
              stroke="#111"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
