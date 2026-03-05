import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { lazy } from "react";
const Materials = lazy(() => import("./pages/Materials"));
const Sales = lazy(() => import("./pages/Sales"));
const Report = lazy(() => import("./pages/Report"));
const CostCalculator = lazy(() => import("./pages/CostCalculator"));
const Expense = lazy(() => import("./pages/Expense"));
const Employees = lazy(() => import("./pages/Employees"));
const Customer = lazy(() => import("./pages/Customer"));
const Raw = lazy(() => import("./pages/Raw"));
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
          <Route path="/customer" element={<Customer />} />
          <Route path="/raw" element={<Raw />} />
        </Routes>
      </HashRouter>
      </AlertProvider>
    </AppDataProvider>
  );
}

export default App;
