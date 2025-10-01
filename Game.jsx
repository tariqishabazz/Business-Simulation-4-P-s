// Game page
// - Main interactive screen for the MarketSim demo.
// - Players choose actions (4 P's) or type a custom action. The front-end sends a payload
//   to `simulateTurn(payload)` and applies the returned stats/event/rivalMove.
// - The mock API can map custom text to option codes and return an explanation so the
//   UI can show why a mapping happened.
// Data contract (summary): payload -> { turn, maxTurns, stats, choice, options, history }
// Response -> { stats, done, event, rivalMove, chosenOption?, explanation? }
// See `src/api.js` for the mock implementation.

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { simulateTurn } from "../api";

export default function Game(
{
    currentTurn = 1,
    maxTurns = 10,
    initialCash = 500,
    initialLoyalty = 10,
    initialMarketShare = 30,
}) 
{
  const navigate = useNavigate();
  // Current turn number (1-based) and progress control
  const [turn, setTurn] = useState(currentTurn);
  // UI selection: either an option code (P1/R1/...) or free-text via customMove
  const [selectedOption, setSelectedOption] = useState(null);
  const [customMove, setCustomMove] = useState("");
  // Submission state: disables submit while awaiting simulator
  const [isSubmitting, setIsSubmitting] = useState(false);
  // When a custom move is submitted, the simulator may return an explanation which we show
  const [lastExplanation, setLastExplanation] = useState("");
  const [lastWasCustom, setLastWasCustom] = useState(false);
  // The last option code chosen by simulator (helps label explanation text)
  const [lastChosenOption, setLastChosenOption] = useState(null);
  const [stats, setStats] = useState(
    {
      cash: initialCash,
      loyalty: initialLoyalty,
      marketShare: initialMarketShare,
    }
  );

  const [event, setEvent] = useState("");
  const [rivalMove, setRivalMove] = useState("");
  const [history, setHistory] = useState([]);

  const optionsData = 
  {
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
  // optionsData is intentionally simple: it is sent to the simulator so the server
  // can reason about available options and map custom text to codes when needed.

  // Compute a simple deterministic overall grade from final stats.
  // Returns a string like 'A', 'B+', 'C', etc.
  const computeOverallGrade = (s) =>
  {
    // Normalize scores to 0..1 ranges. Adjust denominators to match expected ranges.
    const cashScore = Math.min(1, s.cash / 1000); // 1000 or more -> 1.0
    const loyaltyScore = Math.min(1, s.loyalty / 100); // out of 100
    const marketScore = Math.min(1, s.marketShare / 100); // percent out of 100

    const score = cashScore * 0.4 + loyaltyScore * 0.3 + marketScore * 0.3;

    if (score >= 0.9) return "A";
    if (score >= 0.8) return "A-";
    if (score >= 0.7) return "B+";
    if (score >= 0.6) return "B";
    if (score >= 0.5) return "C";
    return "D";
  };

  const handleOptionSelect = (optionCode) => setSelectedOption(optionCode);

  const handleSubmit = async () => 
  {
  // If the player typed a custom move, prefer that over any previously-selected option.
  const useCustom = customMove.trim() !== "";
  const choice = useCustom ? customMove.trim() : selectedOption;
  if (!choice) return;

  const payload = { turn, maxTurns, stats, choice, options: optionsData, history };

  setIsSubmitting(true);
  setLastExplanation("");
  setLastWasCustom(useCustom);

    let result;
    try 
    {
      result = await simulateTurn(payload);
    } 
    
    catch (err) 
    {
      console.error("simulateTurn failed:", err);
      // fallback to a safe mock structure if API fails
      result = { stats, done: false, event: "(No response)", rivalMove: "(No response)" };
    } 
    
    finally 
    {
      setIsSubmitting(false);
    }

    setStats(result.stats || stats);
    setEvent(result.event || "");
    setRivalMove(result.rivalMove || "");
    // If backend returned a mapped chosenOption, prefer that for the selection.
    // Otherwise, decide whether to clear the UI selection depending on how the player submitted:
    // - If the player clicked an option (not a custom text), clear the selection to prepare for the next turn.
    // - If the player submitted a custom move, set selectedOption only when the backend mapped it; otherwise clear.
    if (result.chosenOption) {
      setSelectedOption(result.chosenOption);
    } else {
      // No mapping returned by backend
      if (useCustom) {
        // custom move submitted but not mapped -> clear selection (nothing to highlight)
        setSelectedOption(null);
      } else {
        // player explicitly selected an option -> clear it for next turn
        setSelectedOption(null);
      }
    }

    // Record which option the simulator selected (or the raw choice)
    setLastChosenOption(result.chosenOption || choice || null);

    // Show explanation if provided; if user submitted a custom move but no explanation was
    // returned, show a short fallback so the UI doesn't remain empty.
    if (result.explanation) 
      setLastExplanation(result.explanation);
    
    else if (useCustom) 
      setLastExplanation("(No explanation available)");

    setTurn((prev) => prev + 1);

    setHistory((prev) => [
      { event: result.event, rivalMove: result.rivalMove, playerChoice: result.chosenOption || choice },
      ...prev.slice(0, 2),
    ]);

    setCustomMove("");

    if (result.done) {
      const overallGrade = computeOverallGrade(result.stats);
      navigate("/grades",
      {
        state:
        {
          cash: result.stats.cash,
          loyalty: result.stats.loyalty,
          marketShare: result.stats.marketShare,
          overallGrade,
        },
      });
    }
  };

  useEffect(() => 
  {
    const initializeTurn = async () => {
      const result = await simulateTurn(
      {
        turn: 0,
        stats: { cash: 500, loyalty: 10, marketShare: 30 },
        option: null,
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

      {/* Main */}
      <main className="flex-1 container mx-auto p-4 md:p-6 space-y-4">
      {/* Main content */}
  {/* Turn Progress */}
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

  {/* Event and Rival Cards */}
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

  {/* Stats Cards */}
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

  {/* (history moved down below the Business Decisions grid) */}

  {/* Business Decisions */}
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

  {/* Decision Panel */}
  {/* Event History, shows last 3 events (moved below the 4 P's and above the Decision Panel) */}
  {history.length > 0 && (
    <div className="mb-4 p-3 bg-gray-100 border border-gray-200 rounded-md">
      <h4 className="font-bold mb-2">Last 3 Events:</h4>
      <ul className="text-sm space-y-1">
        {history.map((h, idx) => (
          <li key={idx} className="flex justify-between">
            <div>
              <span className="font-medium">Event:</span> {h.event} |{" "}
              <span className="font-medium">Rival:</span> {h.rivalMove}
            </div>
            <div className="text-sm text-gray-600">{h.playerChoice || "-"}</div>
          </li>
        ))}
      </ul>
    </div>
  )}
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
      className="w-full p-2 border border-gray-300 rounded-md mb-4 text-center"
    />
    <div className="flex justify-center mt-4">
      <motion.button
        onClick={handleSubmit}
        disabled={isSubmitting || (!selectedOption && !customMove.trim())}
        className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 text-center flex items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Thinking...
          </>
        ) : (
          "Submit"
        )}
      </motion.button>
    </div>
    {/* Explanation from the simulator when user entered a custom move */}
    {lastWasCustom && lastExplanation && (
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="font-medium mb-1">{lastChosenOption ? `Chosen: ${lastChosenOption}` : "Mapped choice"} — why</h4>
        <p className="text-sm text-gray-700">{lastExplanation}</p>
      </div>
    )}
  </div>
</main>

    </div>
  );
}

