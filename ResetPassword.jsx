import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

// ResetPassword
// - Simple mock UI used to simulate a password-reset request during development.
// - Submits -> shows an alert and navigates back to login. Replace with a real API
//   call when integrating with the backend.

export default function ResetPassword()
{
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequest = (e) =>
  {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() =>
    {
      setIsLoading(false);
      alert("Password reset request submitted (mock). Returning to login.");
      navigate("/login", { replace: true });
    }, 600);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 text-gray-800 overflow-auto relative">
      <header className="bg-gray-300 shadow-md h-24 md:h-32 w-full flex items-center justify-center px-4">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Game Logo" className="h-16 md:h-24" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-sm md:text-xl text-gray-700">Request a password reset</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="p-[3px] rounded-lg bg-gradient-to-r from-blue-400 via-teal-400 to-yellow-300 shadow-lg">
            <div className="bg-white p-6 md:p-8 rounded-lg">
              <form onSubmit={handleRequest}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded">{isLoading ? 'Sending...' : 'Send reset link'}</button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
