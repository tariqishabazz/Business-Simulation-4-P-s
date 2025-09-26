import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Start() {
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
        <Link to="/game" className="px-6 py-3 bg-[#1252A3] text-white rounded-xl hover:bg-blue-700 text-center font-bold">
          Start Game
        </Link>

        <button
          className="px-6 py-3 bg-gray-400 text-white rounded-xl cursor-not-allowed text-center font-bold" disabled>
          Continue Game (Coming Soon)
        </button>

        <button className="px-6 py-3 bg-gray-400 text-white rounded-xl cursor-not-allowed text-center font-bold" disabled>
          View Previous Grades (Coming Soon)
        </button>
      </div>
    </div>
  );
}
