// Toggle mock API or real backend
export const USE_MOCK = true; // true = use fake API, false = use real backend

// --- MOCK API ---
// Simulates a game turn with random events and rival moves
const mockSimulate = (payload) => {
  // Possible random events and rival actions
  const possibleEvents = [
    "Heavy rain reduces foot traffic",
    "New competitor opens nearby",
    "Social media hype boosts sales",
    "Supply chain delay affects deliveries",
  ];

  const possibleRivalMoves = [
    "Rival launches seasonal drink",
    "Rival offers discount on pastries",
    "Rival advertises on Instagram",
    "Rival expands pop-up locations",
  ];

  // Return a promise to simulate async API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          cash: payload.stats.cash + 50,        // Increase cash
          loyalty: payload.stats.loyalty + 5,   // Increase loyalty
          marketShare: payload.stats.marketShare + 1, // Increase market share
        },
        done: payload.turn >= payload.maxTurns, // Is the game finished?
        event: possibleEvents[Math.floor(Math.random() * possibleEvents.length)],
        rivalMove: possibleRivalMoves[Math.floor(Math.random() * possibleRivalMoves.length)],
      });
    }, 800); // simulate network delay
  });
};

// Mock function to fetch final grades
const mockGrades = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        cash: 250,
        loyalty: 45,
        marketShare: 25,
        overallGrade: "B+",
      });
    }, 600);
  });

// --- REAL API (future backend) ---
const BASE_URL = "http://localhost:5000/api";

// Calls real backend to simulate a turn
const realSimulate = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Network response not ok");
    return res.json();
  } catch (err) {
    console.error("Simulation failed:", err);
    // Return fallback stats if backend fails
    return { stats: payload.stats, done: false };
  }
};

// Calls real backend to fetch final grades
const realGrades = async () => {
  try {
    const res = await fetch(`${BASE_URL}/grades`);
    if (!res.ok) throw new Error("Network response not ok");
    return res.json();
  } catch (err) {
    console.error("Fetching grades failed:", err);
    return null;
  }
};

// --- Exports ---
// Choose mock or real API based on USE_MOCK
export const simulateTurn = (payload) => USE_MOCK ? mockSimulate(payload) : realSimulate(payload);
export const fetchGrades = () => (USE_MOCK ? mockGrades() : realGrades());
