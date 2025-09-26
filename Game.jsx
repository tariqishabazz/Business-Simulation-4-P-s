import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { simulateTurn } from "../api";

export default function Game({
  currentTurn = 1,
  maxTurns = 10,
  initialCash = 500,
  initialLoyalty = 10,
  initialMarketShare = 30,
}) {
  const navigate = useNavigate();

  // Game state
  const [turn, setTurn] = useState(currentTurn);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customMove, setCustomMove] = useState("");
  const [stats, setStats] = useState({
    cash: initialCash,
    loyalty: initialLoyalty,
    marketShare: initialMarketShare,
  });
  const [event, setEvent] = useState("");
  const [rivalMove, setRivalMove] = useState("");
  const [history, setHistory] = useState([]);

  // Game options
  const optionsData = {
    Product: [
      { code: "P1", title: "Seasonal drink", effects: "−$100, +L+3, +S+2%" },
      { code: "P2", title: "Vegan pastry", effects: "−$80, +L+2, +S+1%" },
    ],
    Price: [
      { code: "R1", title: "Discount coffee", effects: "+$60, +S+2%" },
      { code: "R2", title: "Premium pricing", effects: "+$80, −L−1, −S−1%" },
    ],
    Place: [
      { code: "M1", title: "Pop-up near stadium", effects: "−$90, +S+3%" },
      { code: "M2", title: "Mobile order station", effects: "−$60, +L+1, +S+1%" },
    ],
    Promotion: [
      { code: "O1", title: "Instagram ads", effects: "−$50, +L+2, +S+1%" },
      { code: "O2", title: "Sponsor club event", effects: "−$70, +L+3, +S+1%" },
    ],
  };

  // Handle option selection
  const handleOptionSelect = (optionCode) => setSelectedOption(optionCode);

  // Submit player move
  const handleSubmit = async () => {
    const choice = selectedOption || customMove.trim();
    if (!choice) return;

    const payload = { turn, maxTurns, stats, choice };
    const result = await simulateTurn(payload);

    // Update stats and events from API
    setStats(result.stats);
    setEvent(result.event || "");
    setRivalMove(result.rivalMove || "");
    setTurn((prev) => prev + 1);

    // Keep last 3 events in history
    setHistory((prev) => [
      { event: result.event, rivalMove: result.rivalMove },
      ...prev.slice(0, 2),
    ]);

    // Reset selection
    setSelectedOption(null);
    setCustomMove("");

    // Redirect to grades if game is done
    if (result.done) {
      navigate("/grades", {
        state: {
          cash: result.stats.cash,
          loyalty: result.stats.loyalty,
          marketShare: result.stats.marketShare,
        },
      });
    }
  };

  // Initialize first turn
  useEffect(() => {
    const initializeTurn = async () => {
      const result = await simulateTurn({
        turn: 0,
        stats: { cash: 500, loyalty: 10, marketShare: 30 },
        choice: null,
      });
      setEvent(result.event);
      setRivalMove(result.rivalMove);
    };
    initializeTurn();
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 text-gray-800 overflow-auto relative">
      {/* Header */}
      <header className="bg-gray-300 shadow-md h-24 md:h-32 w-full flex items-center justify-center px-4">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Game Logo" className="h-16 md:h-24" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900">
              Capstone MarketSim
            </h1>
            <p className="text-sm md:text-xl text-gray-700">
              Student Business Simulation
            </p>
          </div>
        </div>
      </header>

      {/* Main game content */}
      <main className="flex-1 container mx-auto p-4 md:p-6 space-y-4">
        {/* Turn progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Turn {turn}/{maxTurns}</h2>
            <span className="text-sm text-gray-600">
              {Math.round((turn / maxTurns) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(turn / maxTurns) * 100}%` }}
            />
          </div>
        </div>

        {/* Event and rival cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {event && (
            <div className="p-[3px] rounded-lg bg-gradient-to-r from-blue-400 via-teal-400 to-yellow-300 shadow-md">
              <div className="bg-white p-4 rounded-lg h-full">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">☀️</span>
                  <h3 className="font-medium text-gray-700">Weather/Event</h3>
                </div>
                <p>{event}</p>
              </div>
            </div>
          )}

          {rivalMove && (
            <div className="p-[3px] rounded-lg bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 shadow-md">
              <div className="bg-white p-4 rounded-lg h-full">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">⚔️</span>
                  <h3 className="font-medium text-gray-700">Rival</h3>
                </div>
                <p>{rivalMove}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Cash */}
          <div className="p-[3px] rounded-lg shadow-md">
            <div className="bg-white p-4 rounded-lg h-full flex flex-col items-start">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">💵</span>
                <h3 className="font-medium text-gray-700">Cash</h3>
              </div>
              <p className="text-xl font-bold">${stats.cash}</p>
            </div>
          </div>

          {/* Loyalty */}
          <div className="p-[3px] rounded-lg shadow-md">
            <div className="bg-white p-4 rounded-lg h-full flex flex-col items-start">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">❤️</span>
                <h3 className="font-medium text-gray-700">Loyalty</h3>
              </div>
              <p className="mb-1">{stats.loyalty}/100</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{ width: `${stats.loyalty}%` }}
                />
              </div>
            </div>
          </div>

          {/* Market Share */}
          <div className="p-[3px] rounded-lg shadow-md">
            <div className="bg-white p-4 rounded-lg h-full flex flex-col items-start">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📊</span>
                <h3 className="font-medium text-gray-700">Market Share</h3>
              </div>
              <p className="mb-1">{stats.marketShare}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${stats.marketShare}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Event history (last 3 events) */}
        {history.length > 0 && (
          <div className="mb-4 p-3 bg-gray-100 border border-gray-200 rounded-md">
            <h4 className="font-bold mb-2">Last 3 Events:</h4>
            <ul className="text-sm space-y-1">
              {history.map((h, idx) => (
                <li key={idx}>
                  <span className="font-medium">Event:</span> {h.event} |{" "}
                  <span className="font-medium">Rival:</span> {h.rivalMove}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Business decisions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(optionsData).map(([category, options]) => (
            <div key={category} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg mb-3 text-blue-700">{category}</h3>
              <div className="space-y-3">
                {options.map((option) => (
                  <motion.div
                    key={option.code}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedOption === option.code
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option.code)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{option.title}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {option.code}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{option.effects}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Decision panel */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          {selectedOption && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium">Selected: {selectedOption}</p>
            </div>
          )}
          <input
            type="text"
            placeholder="...or enter a tailored move"
            value={customMove}
            onChange={(e) => setCustomMove(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <motion.button
            onClick={handleSubmit}
            disabled={!selectedOption && !customMove.trim()}
            className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
        </div>
      </main>
    </div>
  );
}
