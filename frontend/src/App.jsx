import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Materials from "./pages/Materials";
import Sales from "./pages/Sales";
import Report from "./pages/Report";
import CostCalculator from "./pages/CostCalculator";
import Expense from "./pages/Expense";
import Employees from "./pages/Employees";
import { AppDataProvider } from "./context/AppDataContext";
import { AlertProvider } from "./component/Alerts";

function App() {
  return (
    <AppDataProvider>
      <AlertProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/report" element={<Report />} />
          <Route path="/cost-calculator" element={<CostCalculator />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/employee" element={<Employees />} />
        </Routes>
      </HashRouter>
      </AlertProvider>
    </AppDataProvider>
  );
}

export default App;
