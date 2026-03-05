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
            bgColor="bg-blue-500"
          />
          <MetricsCard
            title="Expense"
            value={"Rs. " + expense}
            icon={<FaExclamationTriangle size={40} />}
            bgColor="bg-red-500"
          />
          <MetricsCard
            title="Profit"
            value={`Rs. ${profit}`}
            icon={<FaDollarSign size={40} />}
            bgColor="bg-green-500"
          />
          <MetricsCard
            title="Orders"
            value={ordersToday}
            icon={<FaShoppingCart size={40} />}
            bgColor="bg-yellow-500"
          />
          <MetricsCard
            title="Sales"
            value={ordersToday}
            icon={<FaMoneyBill size={40} />}
            bgColor="bg-lime-500"
          />
          <MetricsCard
            title="Customers"
            value={ordersToday}
            icon={<FaUserFriends size={40} />}
            bgColor="bg-cyan-500"
          />
          <MetricsCard
            title="Shops"
            value={ordersToday}
            icon={<FaBuilding size={40} />}
            bgColor="bg-indigo-500"
          />
          <MetricsCard
            title="Employees"
            value={ordersToday}
            icon={<FaUser size={40} />}
            bgColor="bg-stone-900"
          />
        </div>
        <button className="mx-auto flex items-center justify-center p-4 text-white bg-slate-800 font-bold rounded-full shadow-md shadow-black/30 hover:bg-slate-700 transition-colors">
          <FaPlus />
        </button>
      </main>
    </div>
  );
};

export default Home;
