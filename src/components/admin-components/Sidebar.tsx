import { Link } from "react-router-dom";
import { sidebarLinks } from "../../data/admin-data/sidebarLinks";

type SidebarProps = {
  user: {
    name: string;
  };
};

const icons = {
  dashboard: (
    <svg
      width="24"
      height="24"
      fill="none"
      className="bg-white bg-opacity-20 p-2 rounded-lg"
    >
      <rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.2" />
    </svg>
  ),
  notification: (
    <svg
      width="24"
      height="24"
      fill="none"
      className="bg-red-500 p-2 rounded-lg relative"
    >
      <rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.2" />
    </svg>
  ),
  resources: (
    <svg
      width="24"
      height="24"
      fill="none"
      className="bg-green-500 p-2 rounded-lg"
    >
      <rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.2" />
    </svg>
  ),
  projects: (
    <svg
      width="24"
      height="24"
      fill="none"
      className="bg-blue-400 p-2 rounded-lg"
    >
      <rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.2" />
    </svg>
  ),
  blog: (
    <svg
      width="24"
      height="24"
      fill="none"
      className="bg-green-300 p-2 rounded-lg"
    >
      <rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.2" />
    </svg>
  ),
  members: (
    <svg
      width="24"
      height="24"
      fill="none"
      className="bg-cyan-400 p-2 rounded-lg"
    >
      <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.2" />
    </svg>
  ),
};

export default function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#07295B] min-h-screen flex flex-col items-center py-8 text-white">
      <div className="flex flex-col items-center mb-8">
        <div className="rounded-full w-16 h-16 bg-purple-400 mb-2"></div>
        <span className="font-bold text-xl">{user.name}</span>
      </div>
      <nav className="flex-1 w-full">
        <span className="pl-8 text-sm mb-2 block opacity-70">Menu</span>
        <ul className="space-y-2">
          {sidebarLinks.map(({ icon, label, notification, path }) => (
            <li key={label}>
              <Link
                to={path}
                className="flex items-center px-8 py-2 hover:bg-white hover:bg-opacity-10 rounded-lg relative"
              >
                {icons[icon as keyof typeof icons]}
                <span className="ml-4">{label}</span>
                {notification > 0 && (
                  <span className="absolute right-6 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {notification}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className="mt-auto mb-4 text-lg font-bold">LOGOUT</button>
    </aside>
  );
}
