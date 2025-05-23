import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="bg-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-xl font-semibold text-gray-800">
          NpcInnovationHub
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-8">
            <li>
              <a
                href="#"
                className="text-teal-500 border-b-2 border-teal-500 pb-1"
                style={{ color: "#0175C3" }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-teal-500"
                style={{ color: "#0175C3" }}
              >
                AboutHub
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-teal-500"
                style={{ color: "#0175C3" }}
              >
                Members
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-teal-500"
                style={{ color: "#0175C3" }}
              >
                Projects
              </a>
            </li>
          </ul>
        </nav>

        {/* Sign In Button */}
        <div>
          <button
            onClick={() => navigate("/signup")}
            className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
