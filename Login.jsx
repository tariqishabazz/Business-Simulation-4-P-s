// Login page
// - Shows a login form and handles authentication (currently mocked via `loginUser`)
// - Persists token to localStorage or sessionStorage depending on "Remember me"
// - Navigates to `/start` on success
// Props accepted (with defaults):
// - logoText, subtitleText: strings used in the header
// - rememberMe: boolean default for the checkbox
// - showRegister: whether to show the Register link
// The component is intentionally lightweight so mocking and UI iteration are easy.

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import Logo from "../assets/Logo.png";


export default function LoginPage({
  logoText = "Capstone MarketSim",
  subtitleText = "Student Business Simulation",
  rememberMe = true,
  showRegister = true,
})
{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemembered, setIsRemembered] = useState(rememberMe);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) =>
  {
    // Prevent regular form submit navigation
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      // Call the API wrapper. In development `loginUser` is a mock that resolves for
      // student@example.com / password. In production this should call the real backend.
      const userData = await loginUser({ email, password, rememberMe: isRemembered });

      // Persist token according to "Remember me".
      // - localStorage persists across browser sessions
      // - sessionStorage clears on tab/window close
      if (userData?.token) {
        if (isRemembered) {
          localStorage.setItem("authToken", userData.token);
          localStorage.setItem("authUser", JSON.stringify({ id: userData.id, name: userData.name, email: userData.email }));
        } else {
          sessionStorage.setItem("authToken", userData.token);
          sessionStorage.setItem("authUser", JSON.stringify({ id: userData.id, name: userData.name, email: userData.email }));
        }
      }

      // Navigate to Start page after successful login
      navigate("/start", { replace: true });
    } catch (error) {
      setErrorMessage(error?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 text-gray-800 overflow-auto relative">
      <header className="bg-gray-300 shadow-md h-24 md:h-32 w-full flex items-center justify-center px-4">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Game Logo" className="h-16 md:h-24" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900">{logoText}</h1>
            <p className="text-sm md:text-xl text-gray-700">{subtitleText}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="p-[3px] rounded-lg bg-gradient-to-r from-blue-400 via-teal-400 to-yellow-300 shadow-lg">
            <div className="bg-white p-6 md:p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm"
                >
                  {errorMessage}
                </motion.div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button type="button" onClick={() => navigate('/reset')} className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {rememberMe && (
                  <div className="flex items-center mb-6">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={isRemembered}
                      onChange={() => setIsRemembered(!isRemembered)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
                {/* Temporary skip button for development: goes straight to Start */}
                <button
                  type="button"
                  onClick={() => navigate("/start", { replace: true })}
                  className="w-full mt-3 bg-gray-200 text-gray-800 py-3 px-6 rounded-md font-medium hover:bg-gray-300"
                >
                  Skip login — go to Start
                </button>
              </form>

              {showRegister && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => navigate('/register')} className="text-blue-600 hover:text-blue-800 font-medium">
                      Register now
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
