import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

// RegisterPage
// - Minimal placeholder for account creation during demo. Replace with real
//   registration API flow when backend is ready. Currently it fakes a delay and
//   returns to the login screen.
export default function RegisterPage()
{
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) =>
  {
    e.preventDefault();
    setIsLoading(true);
    // placeholder - real registration flow later
    setTimeout(() =>
    {
      setIsLoading(false);
      alert("Registration flow not implemented yet. Returning to login.");
      navigate("/login", { replace: true });
    }, 600);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 text-gray-800 overflow-auto relative">
      <header className="bg-gray-300 shadow-md h-24 md:h-32 w-full flex items-center justify-center px-4">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Game Logo" className="h-16 md:h-24" />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900">Register</h1>
            <p className="text-sm md:text-xl text-gray-700">Create your account</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="p-[3px] rounded-lg bg-gradient-to-r from-blue-400 via-teal-400 to-yellow-300 shadow-lg">
            <div className="bg-white p-6 md:p-8 rounded-lg">
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded">{isLoading ? 'Creating...' : 'Create account'}</button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
