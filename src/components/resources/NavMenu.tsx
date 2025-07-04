import React from "react";
import { Link } from "react-router-dom";

const navItems = [
  { name: "HOME", path: "/resources-room" },
  { name: "ALL RESOURCES", path: "/resources-room/all-resources" },

  { name: "CATEGORIES", path: "/resources-room/categories" },
  { name: "CONTACTS", path: "/resources-room" },
];

interface NavMenuProps {
  active: string;
}

const NavMenu: React.FC<NavMenuProps> = ({ active }) => (
  <nav className="w-full">
    <ul className="flex space-x-8 justify-center font-semibold text-white">
      {navItems.map((item) => (
        <li
          key={item.name}
          className={`pb-2 border-b-4 ${
            active === item.name ? "border-white" : "border-transparent"
          }`}
        >
          <Link to={item.path}>{item.name}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default NavMenu;
