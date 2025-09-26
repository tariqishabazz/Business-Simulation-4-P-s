import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Game from "./pages/Game";
import Grades from "./pages/Grades";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/game" element={<Game />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="*" element={<p className="p-6 text-center">Page not found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
