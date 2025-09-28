// Start page
// - Entry hub after login. Minimal UI: start a new game, logout, placeholders for future features.
// - Keeps routing simple and intentionally avoids complex state; session/auth tokens live in storage.
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Start()
{
  const navigate = useNavigate();

  // Clear both storage locations and return to login. Useful in demo/dev.
  const handleLogout = () =>
  {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Logo + Title */}
      <div className="flex flex-col md:flex-row items-center mb-12">
        <img src={Logo} alt="Game Logo" className="h-24 md:h-32 mb-4 md:mb-0 md:mr-6" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Capstone MarketSim
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Student Business Simulation
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Navigate to the main game page */}
        <Link to="/game" className="px-6 py-3 bg-[#1252A3] text-white rounded-xl hover:bg-blue-700 text-center font-bold">
          Start Game
        </Link>

        {/* Disabled placeholders for future features (keeps layout stable during development) */}
        <button className="px-6 py-3 bg-gray-400 text-white rounded-xl cursor-not-allowed text-center font-bold" disabled>
          Continue Game (Coming Soon)
        </button>

        <button className="px-6 py-3 bg-gray-400 text-white rounded-xl cursor-not-allowed text-center font-bold" disabled>
          View Previous Grades (Coming Soon)
        </button>

        {/* Logout clears local session and returns to login */}
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-[#1252A3] text-white rounded-xl hover:bg-blue-700 text-center font-bold"
        >
          Logout / Back to Login
        </button>
      </div>
    </div>
  );
}
