import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Materials from "./pages/Materials";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/materials" element={<Materials />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
