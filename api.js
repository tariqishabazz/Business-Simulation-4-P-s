// =======================
// API CONFIGURATION
// =======================

// Toggle between using a mock API (for local testing) or a real backend
// true = use fake/mock data, false = fetch data from actual server
// =======================
// API CONFIGURATION
// =======================
// This file abstracts network calls for the app. During development we use a local
// mock implementation so frontend work can proceed without a backend. To enable a
// real backend, set `USE_MOCK = false` and update `BASE_URL` to point at your server.
//
// The mock is intentionally helpful:
// - It returns deterministic-ish stats and random events so the UI feels dynamic.
// - When the payload contains `options` and `choice` is a free-text string, the
//   mock attempts to map the text to an option code and returns an `explanation`
//   which the frontend displays. This simulates what a ChatGPT-backed server would do.

export const USE_MOCK = true;

// =======================
// MOCK API FUNCTIONS
// =======================

// Simulate a single game turn
// payload: an object containing current stats, turn number, max turns, and player choice
const mockSimulate = (payload) =>
{
  console.log("api: mockSimulate called", { turn: payload.turn, choice: payload.choice });
  // Random events that can happen in a turn
  const possibleEvents = [
    "Heavy rain reduces foot traffic",
    "New competitor opens nearby",
    "Social media hype boosts sales",
    "Supply chain delay affects deliveries",
  ];

  // Random rival actions that can affect the player
  const possibleRivalMoves = [
    "Rival launches seasonal drink",
    "Rival offers discount on pastries",
    "Rival advertises on Instagram",
    "Rival expands pop-up locations",
  ];

  // Return a promise to simulate async network call
  return new Promise((resolve) =>
  {
    setTimeout(() =>
    {
      // Return updated stats and a random event/rival move
      // Dev-only mapping: if `payload.options` exists and `payload.choice` is a string
      // (not already an option code), attempt to map it to an existing option.
      // Heuristics used (in order): exact code match, title substring match, simple
      // keyword overlap. When a mapping is found the mock returns `chosenOption` and
      // a short `explanation` describing why it mapped.
      let chosenOption = null;
      let explanation = null;

      try 
      {
        const choiceRaw = payload.choice;
        if (payload.options && typeof choiceRaw === 'string' && !/^[A-Za-z]\d+$/.test(choiceRaw.trim())) 
        {
          // Flatten options
          const opts = [];
          Object.keys(payload.options).forEach((cat) => {
            (payload.options[cat] || []).forEach((o) => opts.push({ ...o, category: cat }));
          });

          const choice = choiceRaw.trim().toLowerCase();
          // Exact code match
          const exact = opts.find(o => (o.code || '').toLowerCase() === choice);
          if (exact) 
          {
            chosenOption = exact.code;
            explanation = `Input matched option code ${chosenOption}.`;
          } 
          
          else 
          {
            // Match by title content
            const byTitle = opts.find(o => choice.includes((o.title || '').toLowerCase()) || (o.title || '').toLowerCase().includes(choice));
            if (byTitle) 
            {
              chosenOption = byTitle.code;
              explanation = `Mapped your custom input to ${chosenOption} because it mentions "${byTitle.title}".`;
            } 
            
            else 
              {
              // simple word overlap heuristic
              const words = choice.split(/\W+/).filter(Boolean);
              let best = null;
              let bestCount = 0;
              
              opts.forEach(o => 
              {
                const titleWords = (o.title || '').toLowerCase().split(/\W+/).filter(Boolean);
                const count = words.reduce((acc, w) => acc + (titleWords.includes(w) ? 1 : 0), 0);
                
                if (count > bestCount) 
                  { bestCount = count; best = o; }
              });
              
              if (best && bestCount > 0) 
              {
                chosenOption = best.code;
                explanation = `Mapped your custom input to ${chosenOption} by matching keywords in the option title.`;
              }
            }
          }
        }
      } 
      
      catch (e) 
      {
        // ignore mapping errors in mock
        chosenOption = null;
        explanation = null;
      }

      resolve(
      {
        stats: 
        {
          cash: payload.stats.cash + 50,        // Increment cash as example
          loyalty: payload.stats.loyalty + 5,   // Increment loyalty
          marketShare: payload.stats.marketShare + 1, // Increment market share
        },
        done: payload.turn >= payload.maxTurns, // Check if game is finished
        event: possibleEvents[Math.floor(Math.random() * possibleEvents.length)],
        rivalMove: possibleRivalMoves[Math.floor(Math.random() * possibleRivalMoves.length)],
        chosenOption,
        explanation,
      });
    }, 800); // Simulate network delay
  });
};

// Simulate fetching final grades (mock)
// Returns a sample report for testing frontend display
const mockGrades = () =>
  new Promise((resolve) =>
  {
    setTimeout(() =>
    {
      resolve({
        cash: 250,
        loyalty: 45,
        marketShare: 25,
        overallGrade: "B+", // Example grade
      });
    }, 600);
  });

// =======================
// REAL API FUNCTIONS
// =======================

const BASE_URL = "http://localhost:5000/api"; // Change this to your backend URL

// Send a POST request to backend to simulate a turn
const realSimulate = async (payload) =>
{
  console.log("api: realSimulate called", { turn: payload.turn, choice: payload.choice, BASE_URL });
  
  try
  {
    const res = await fetch(`${BASE_URL}/simulate`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Network response not ok");
    return res.json(); // Return parsed JSON response
  } catch (err)
  {
    console.error("Simulation failed:", err);
    // Fallback to current stats if API fails
    return { stats: payload.stats, done: false };
  }
};

// Send a GET request to fetch final grades from backend
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
    return null; // Return null if API fails
  }
};

// =======================
// EXPORTS
// =======================

// Expose one function for simulateTurn: chooses mock or real API
export const simulateTurn = (payload) =>
{
  if (USE_MOCK)
  {
    console.log("api: simulateTurn -> using MOCK");
    return mockSimulate(payload);
  }
  console.log("api: simulateTurn -> using REAL");
  return realSimulate(payload);
};

// Expose one function for fetching grades: chooses mock or real API
export const fetchGrades = () =>
{
  console.log("api: fetchGrades ->", USE_MOCK ? "MOCK" : `REAL -> ${BASE_URL}`);
  return (USE_MOCK ? mockGrades() : realGrades());
};

// =======================
// AUTH (mock)
// =======================
// A small mock loginUser to be used by the login page while developing.
export const loginUser = async ({ email, password, rememberMe }) =>
{
  if (USE_MOCK)
  {
    // very small validation for mock
    return new Promise((resolve, reject) =>
    {
      setTimeout(() =>
      {
        if (email === "student@example.com" && password === "password")
        {
          resolve({ id: 1, name: "Student", email, token: "mock-token-123", rememberMe });
        } 
        else
        {
          reject(new Error("Invalid credentials (use student@example.com / password)"));
        }
      }, 600);
    });
  }

  // real login flow (fallback)
  try
  {
    const res = await fetch(`${BASE_URL}/login`, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  } 
  
  catch (err)
  {
    console.error("loginUser failed:", err);
    throw err;
  }
};
