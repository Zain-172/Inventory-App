import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import Sales from "./pages/Sales";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
