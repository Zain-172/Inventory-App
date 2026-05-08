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
const Khata = lazy(() => import("./pages/Khata"));
const Raw = lazy(() => import("./pages/Raw"));
const EmployeeAccount = lazy(() => import("./pages/EmployeeAccount"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgetPassword = lazy(() => import("./pages/Forget"));
const Profit = lazy(() => import("./pages/Profit"));
const Barcode = lazy(() => import("./pages/Barcode"));
const UserAccount = lazy(() => import("./pages/UserAccount"));
const Order = lazy(() => import("./pages/Order"));
const CustomerSale = lazy(() => import("./pages/CustomerSale"));
const Configure = lazy(() => import("./pages/Configure"));
const ProductHistory = lazy(() => import("./pages/ProductHistory"));
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
          <Route path="/khata" element={<Khata />} />
          <Route path="/raw" element={<Raw />} />
          <Route path="/account/:id" element={<EmployeeAccount />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/profit" element={<Profit />} />
          <Route path="/barcode" element={<Barcode />} />
          <Route path="/user-account" element={<UserAccount />} />
          <Route path="/order" element={<Order />} />
          <Route path="/configure" element={<Configure />} />
          <Route path="/product-history" element={<ProductHistory />} />
          <Route path="/customer-sale/:id" element={<CustomerSale />} />
        </Routes>
      </HashRouter>
      </AlertProvider>
    </AppDataProvider>
  );
}

export default App;
