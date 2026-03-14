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
  FaBook,
  FaAddressBook,
} from "react-icons/fa";
import MetricsCard from "../component/Metrics";
import TopBar from "../component/TopBar";
import { useAppData } from "../context/AppDataContext";
import { useState, useEffect } from "react";
import { getDashboardData } from "../api/Dashboard";

const Home = () => {
  const { loading, products } = useAppData();
  const [expense, setExpense] = useState(0);
  const [profit, setProfit] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);
  const [salesToday, setSalesToday] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [khataCount, setKhataCount] = useState(0);
  const [shopCount, setShopCount] = useState(0);
  const [att, setAtt] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const dashboardData = await getDashboardData();
        console.log("Dashboard Data:", dashboardData);
        setExpense(dashboardData.dailyExpense);
        setCustomerCount(dashboardData.customerCount);
        setEmployeeCount(dashboardData.employeeCount);
        setOrdersToday(dashboardData.dailyOrders);
        setSalesToday(dashboardData.dailySale);
        setShopCount(dashboardData.shopCount);
        setProfit(dashboardData.dailyProfit);
        setAtt(dashboardData.attendance);
        setKhataCount(dashboardData.khataCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
    fetchData();
  }, []);
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
            title="Expense Today"
            value={"Rs. " + expense}
            icon={<FaExclamationTriangle size={40} />}
            bgColor="bg-gradient-to-r from-red-700 to-red-400"
            to="/expense"
          />
          <MetricsCard
            title="Profit Today"
            value={`Rs. ${profit}`}
            icon={<FaDollarSign size={40} />}
            bgColor="bg-gradient-to-r from-green-700 to-green-400"
            to="/sales"
          />
          <MetricsCard
            title="Orders Today"
            value={ordersToday}
            icon={<FaShoppingCart size={40} />}
            bgColor="bg-gradient-to-r from-yellow-700 to-yellow-400"
            to="/sales"
          />
          <MetricsCard
            title="Sales Today"
            value={salesToday}
            icon={<FaMoneyBill size={40} />}
            bgColor="bg-gradient-to-r from-lime-700 to-lime-400"
            to="/sales"
          />
          <MetricsCard
            title="Customers"
            value={customerCount}
            icon={<FaUserFriends size={40} />}
            bgColor="bg-gradient-to-r from-cyan-700 to-cyan-400"
            to="/customer"
          />
          <MetricsCard
            title="Shops"
            value={shopCount}
            icon={<FaBuilding size={40} />}
            bgColor="bg-gradient-to-r from-indigo-700 to-indigo-400"
            to="/customer"
          />
          <MetricsCard
            title="Employees"
            value={employeeCount}
            icon={<FaUser size={40} />}
            bgColor="bg-gradient-to-r from-pink-700 to-pink-400"
            to="/employee"
          />
          <MetricsCard
            title="Reports"
            value={"Ready"}
            icon={<FaBook size={40} />}
            bgColor="bg-gradient-to-r from-zinc-700 to-zinc-400"
            to="/report"
          />
          <MetricsCard
            title="Khata"
            value={khataCount}
            icon={<FaAddressBook size={40} />}
            bgColor="bg-gradient-to-r from-teal-700 to-teal-400"
            to="/khata"
          />
          <MetricsCard
            title="Attendence"
            value={att > 0 ? `${att} Presents` : "Pending"}
            icon={<FaUser size={40} />}
            bgColor="bg-gradient-to-r from-sky-700 to-sky-400"
            to="/attendence"
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
