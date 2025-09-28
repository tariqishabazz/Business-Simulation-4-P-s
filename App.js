// App routing
// - Defines the main client-side routes for the demo application. Keep routes simple
//   during development; when auth is added, consider a protected-route wrapper.
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Start from "./pages/Start";
import Game from "./pages/Game";
import Grades from "./pages/Grades";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

function App()
{
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset" element={<ResetPassword />} />
        {/* show login first */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/start" element={<Start />} />
        <Route path="/game" element={<Game />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="*" element={<p className="p-6 text-center">Page not found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
