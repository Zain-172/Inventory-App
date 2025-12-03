import Navigation from "../component/Navigation";
import Table from "../component/Table";
import {
  FaBox,
  FaExclamationTriangle,
  FaDollarSign,
  FaShoppingCart,
  FaHandHolding,
  FaHandshake,
} from "react-icons/fa";
import MetricsCard from "../component/Metrics";
import TopBar from "../component/TopBar";
import { useAppData } from "../context/AppDataContext";
import { useState, useMemo, useEffect } from "react";

const Home = () => {
  const { sales, loading, products } = useAppData();
  const [salesByDate, setSalesByDate] = useState(0);
  const [profit, setProfit] = useState(0);

  const ordersToday = useMemo(() => {
    if (!sales || sales.length === 0) return 0;
    const today = new Date();
    return sales.filter((sale) => {
      if (!sale.sale_date) return false;
      const saleDate = new Date(sale.sale_date);
      if (isNaN(saleDate)) return false;
      return (
        saleDate.getFullYear() === today.getFullYear() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getDate() === today.getDate()
      );
    }).length;
  }, [sales]);


  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`http://localhost:5000/sale/by-date?date=${today}`);
      const data = await res.json();
      setSalesByDate((data.length > 0 ? data[0]["sum(total_amount)"] : 0));
      console.log("Sales by date: ", data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`http://localhost:5000/sale/cost-by-date?date=${today}`);
      const data = await res.json();
      const res2 = await fetch(`http://localhost:5000/product/stock-by-date?date=${today}`);
      const stockData = await res2.json();
      const res3 = await fetch(`http://localhost:5000/expense/by-date?date=${today}`);
      const expenseData = await res3.json()
      setProfit((salesByDate) - (data.length > 0 ? data[0]["sum(total_cost)"] : 0) - (stockData.length > 0 ? stockData[0]["sum(stock * cost_price)"] : 0) - (expenseData.length > 0 ? expenseData[0]["total"] : 0));
      console.log("Sales by date: ", data, "Stock data: ", stockData, "Expense data: ", expenseData);
    };
    fetchData();
  }, [salesByDate]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="grid min-h-screen">
      <nav>
        <Navigation />
      </nav>
      <main className="flex flex-col my-12">
        <TopBar />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-6 px-2">
          <MetricsCard
            title="Total Products"
            value={products.length}
            icon={<FaBox size={20} />}
            bgColor="bg-blue-500/40"
          />
          <MetricsCard
            title="Today Sales"
            value={salesByDate}
            icon={<FaHandshake size={20} />}
            bgColor="bg-orange-500/40"
          />
          <MetricsCard
            title="Profit"
            value={`Rs. ${profit}`}
            icon={<FaDollarSign size={20} />}
            bgColor="bg-green-500/40"
          />
          <MetricsCard
            title="Orders Today"
            value={ordersToday}
            icon={<FaShoppingCart size={20} />}
            bgColor="bg-yellow-500/40"
          />
        </div>
        <div className="px-2 mb-6 flex flex-col gap-6 items-center justify-center">
          <Table data={sales.map((item) => ({
            ID: item.id,
            Invoice: item.invoice_id,
            Salesman: item.salesman,
            Date: item.sale_date,
            Amount: `Rs. ${item.total_amount}`,
            Quantity: item.total_items
          }))} />
          <Table data={products} accent="bg-yellow-500/40" />
        </div>
      </main>
    </div>
  );
};

export default Home;
