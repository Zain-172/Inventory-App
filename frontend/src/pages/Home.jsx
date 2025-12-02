import Navigation from "../component/Navigation";
import Table from "../component/Table";
import {
  FaBox,
  FaExclamationTriangle,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";
import MetricsCard from "../component/Metrics";
import TopBar from "../component/TopBar";
import { useAppData } from "../context/AppDataContext";
import { useState, useMemo } from "react";
const Home = () => {
  const { sales, loading, products } = useAppData();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
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

  if (loading) return <div>Loading...</div>;
  return (
    <div className="grid  min-h-screen" onClick={() => setOpen(false)}>
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
            title="Low Stock Items"
            value="8"
            icon={<FaExclamationTriangle size={20} />}
            bgColor="bg-red-500/40"
          />
          <MetricsCard
            title="Profit"
            value="Rs. 15,200"
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
          <Table open={open} setOpen={setOpen} data={sales} />
          <Table
            open={open2}
            setOpen={setOpen2}
            data={products}
            accent="bg-yellow-500/40"
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
