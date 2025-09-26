// Toggle mock API or real backend
export const USE_MOCK = true;

// --- MOCK API ---
const mockSimulate = (payload) => {
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

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: {
          cash: payload.stats.cash + 50,
          loyalty: payload.stats.loyalty + 5,
          marketShare: payload.stats.marketShare + 1,
        },
        done: payload.turn >= payload.maxTurns,
        event: possibleEvents[Math.floor(Math.random() * possibleEvents.length)],
        rivalMove: possibleRivalMoves[Math.floor(Math.random() * possibleRivalMoves.length)],
      });
    }, 800);
  });
};

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

const realSimulate = async (payload) => {
  try 
  {
    const res = await fetch(`${BASE_URL}/simulate`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) throw new Error("Network response not ok");
    return res.json();
  } 
  
  catch (err) 
  {
    console.error("Simulation failed:", err);
    return { stats: payload.stats, done: false };
  }
};

const realGrades = async () => 
{
  try 
  {
    const res = await fetch(`${BASE_URL}/grades`);
    if (!res.ok) throw new Error("Network response not ok");
    return res.json();
  } 
  
  catch (err) 
  {
    console.error("Fetching grades failed:", err);
    return null;
  }
};

// --- Exports ---
export const simulateTurn = (payload) => USE_MOCK ? mockSimulate(payload) : realSimulate(payload);

export const fetchGrades = () => (USE_MOCK ? mockGrades() : realGrades());
