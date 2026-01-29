import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAboutDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-3xl font-semibold text-gray-800">
          NpcInnovationHub
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-8 items-center">
            <li>
              <a
                href="/"
                className="text-teal-500 border-b-2 border-teal-500 pb-1"
                style={{ color: "#0175C3" }}
              >
                Home
              </a>
            </li>

            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowAboutDropdown(!showAboutDropdown)}
                className="text-2xl text-blue-700 hover:text-blue-800 transition-colors duration-200"
                aria-expanded={showAboutDropdown}
                aria-haspopup="true"
              >
                AboutHub
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ease-out ${
                  showAboutDropdown
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-1 pointer-events-none"
                }`}
              >
                <ul>
                  <li>
                    <Link
                      to="/blog"
                      className="block px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Blog
                    </Link>
                  </li>
                  <li className="border-t border-gray-100">
                    <a
                      href="/hub-information"
                      className="block px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                    >
                      Hub Information
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <a
                href="/members"
                className="text-gray-600 hover:text-teal-500"
                style={{ color: "#0175C3" }}
              >
                Members
              </a>
            </li>
            <li>
              <a
                href="/projects"
                className="text-gray-600 hover:text-teal-500"
                style={{ color: "#0175C3" }}
              >
                Projects
              </a>
            </li>
            {/* Dashboard Link */}
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 hover:text-teal-500 focus:outline-none"
                style={{
                  color: "#0175C3",
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                }}
              >
                User Dashboard
              </button>
            </li>
            {/* Resources Room Link */}
            <li>
              <button
                onClick={() => navigate("/resources-room")}
                className="text-gray-600 hover:text-teal-500 focus:outline-none"
                style={{
                  color: "#0175C3",
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
                }}
              >
                Resources Room
              </button>
            </li>
          </ul>
        </nav>

        {/* Sign In Button */}
        <div>
          <button
            onClick={() => navigate("/signup")}
            className="text-2xl bg-blue-700 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors duration-200 shadow-sm"
          >
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
