import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import Sales from "./pages/Sales";
import Report from "./pages/Report";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
