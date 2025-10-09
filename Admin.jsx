import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

// Admin dashboard component
export function AdminDashboard() {
  return (
    <div className="flex flex-col w-full h-full bg-gray-50 text-gray-800">
      <header className="bg-gray-300 shadow-md h-20 md:h-24 w-full flex items-center justify-center px-4">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Game Logo" className="h-16 md:h-24" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900">Capstone MarketSim</h1>
            <p className="text-sm md:text-xl text-gray-700">Admin Dashboard</p>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="p-[3px] rounded-lg bg-gradient-to-r from-blue-400 via-teal-400 to-yellow-300 shadow-lg w-full max-w-2xl">
          <div className="bg-white p-8 md:p-12 rounded-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome, Admin!</h2>
            <p className="text-gray-700 mb-6">Here you can manage users, view reports, and configure game settings. (This is a placeholder screen—extend as needed.)</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Admin login page (mirrors the student login design)
export function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      if (email && password) {
        // In a real app you'd call an API and set auth state then navigate
        console.log("Admin login success", { email });
        navigate("/admin");
      } else {
        setErrorMessage("Please enter both email and password");
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 text-gray-800">
      <header className="bg-gray-300 shadow-md h-24 md:h-32 w-full flex items-center justify-center px-4">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Game Logo" className="h-16 md:h-24" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-sm md:text-xl text-gray-700">Capstone MarketSim</p>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full px-4 py-6 flex items-start justify-center overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">
          <div className="p-[3px] rounded-lg bg-gradient-to-r from-blue-400 via-teal-400 to-yellow-300 shadow-lg">
            <div className="bg-white p-6 md:p-8 rounded-lg">
              {errorMessage && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {errorMessage}
                </motion.div>
              )}
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="mb-6">
                  <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"  />
                </div>
                <motion.button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-base font-semibold hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function AdminWrapper() {
  // Simple wrapper that would route to AdminLoginPage or AdminDashboard based on pathname
  if (typeof window !== "undefined" && window.location.pathname === "/admin") return <AdminDashboard />;
  return <AdminLoginPage />;
}
