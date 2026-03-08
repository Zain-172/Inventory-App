import Navigation from "../component/Navigation";
import Table from "../component/Table";
import {
  FaBox,
  FaExclamationTriangle,
  FaDollarSign,
  FaShoppingCart,
  FaThLarge,
  FaMoneyBill,
  FaUser,
  FaBuilding,
  FaUserFriends,
  FaPlus,
} from "react-icons/fa";
import MetricsCard from "../component/Metrics";
import TopBar from "../component/TopBar";
import { useAppData } from "../context/AppDataContext";
import { useState, useMemo, useEffect } from "react";

const Home = () => {
  const { sales, loading, products } = useAppData();
  const [expense, setExpense] = useState(0);
  const [profit, setProfit] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="grid">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <h1 className="text-2xl font-bold flex gap-2 items-center py-2"><FaThLarge />Dashboard</h1>
      </TopBar>
      <main className="flex flex-col my-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-6 px-2">
          <MetricsCard
            title="Products"
            value={products.length}
            icon={<FaBox size={40} />}
            bgColor="bg-gradient-to-r from-blue-700 to-blue-400"
            to="/materials"
          />
          <MetricsCard
            title="Expense"
            value={"Rs. " + expense}
            icon={<FaExclamationTriangle size={40} />}
            bgColor="bg-gradient-to-r from-red-700 to-red-400"
            to="/expense"
          />
          <MetricsCard
            title="Profit"
            value={`Rs. ${profit}`}
            icon={<FaDollarSign size={40} />}
            bgColor="bg-gradient-to-r from-green-700 to-green-400"
            to="/sales"
          />
          <MetricsCard
            title="Orders"
            value={ordersToday}
            icon={<FaShoppingCart size={40} />}
            bgColor="bg-gradient-to-r from-yellow-700 to-yellow-400"
            to="/sales"
          />
          <MetricsCard
            title="Sales"
            value={ordersToday}
            icon={<FaMoneyBill size={40} />}
            bgColor="bg-gradient-to-r from-lime-700 to-lime-400"
            to="/sales"
          />
          <MetricsCard
            title="Customers"
            value={ordersToday}
            icon={<FaUserFriends size={40} />}
            bgColor="bg-gradient-to-r from-cyan-700 to-cyan-400"
            to="/customer"
          />
          <MetricsCard
            title="Shops"
            value={ordersToday}
            icon={<FaBuilding size={40} />}
            bgColor="bg-gradient-to-r from-indigo-700 to-indigo-400"
            to="/shops"
          />
          <MetricsCard
            title="Employees"
            value={ordersToday}
            icon={<FaUser size={40} />}
            bgColor="bg-gradient-to-r from-pink-700 to-pink-400"
            to="/employee"
          />
        </div>
        <button className="mx-auto flex items-center justify-center p-4 text-white bg-neutral-400 font-bold rounded-full shadow-md shadow-black/30 hover:bg-slate-700 transition-colors">
          <FaPlus />
        </button>
      </main>
    </div>
  );
};

export default Home;
