import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
const Home = lazy(() => import("./pages/Home"));
const Materials = lazy(() => import("./pages/Materials"));
const Sales = lazy(() => import("./pages/Sales"));
const Report = lazy(() => import("./pages/Report"));
const CostCalculator = lazy(() => import("./pages/CostCalculator"));
const Expense = lazy(() => import("./pages/Expense"));
const Employees = lazy(() => import("./pages/Employees"));
const Attendence = lazy(() => import("./pages/Attendence"));
const Customer = lazy(() => import("./pages/Customer"));
const Raw = lazy(() => import("./pages/Raw"));
const EmployeeAccount = lazy(() => import("./pages/EmployeeAccount"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgetPassword = lazy(() => import("./pages/Forget"));
import { AppDataProvider } from "./context/AppDataContext";
import { AlertProvider } from "./component/Alerts";

function App() {
  return (
    <AppDataProvider>
      <AlertProvider>
      <HashRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/report" element={<Report />} />
          <Route path="/cost-calculator" element={<CostCalculator />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/employee" element={<Employees />} />
          <Route path="/attendence" element={<Attendence />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/raw" element={<Raw />} />
          <Route path="/account/:id" element={<EmployeeAccount />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Routes>
      </HashRouter>
      </AlertProvider>
    </AppDataProvider>
  );
}

export default App;
