import React from "react";
import { Link, useNavigate } from "react-router-dom";

const navItems = [
  { name: "HOME", path: "/resources-room", type: "link" },
  {
    name: "ALL RESOURCES",
    path: "/resources-room/all-resources",
    type: "link",
  },
  { name: "CATEGORIES", path: "/resources-room/categories", type: "link" },
  { name: "BACK", path: "", type: "back" },
];

interface NavMenuProps {
  active: string;
}

const NavMenu: React.FC<NavMenuProps> = ({ active }) => {
  const navigate = useNavigate();

  const handleNavigation = (item: (typeof navItems)[0]) => {
    if (item.type === "back") {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <nav className="w-full">
      <ul className="flex space-x-8 justify-center font-semibold text-white">
        {navItems.map((item) => (
          <li
            key={item.name}
            className={`pb-2 border-b-4 ${
              active === item.name ? "border-white" : "border-transparent"
            }`}
          >
            {item.type === "back" ? (
              <button
                onClick={() => handleNavigation(item)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                {item.name}
              </button>
            ) : (
              <Link to={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;
