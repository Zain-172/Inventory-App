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
import { useEffect, useState } from "react";
const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/product");
        const result = await response.json();
        if (isMounted) setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  const headers = ["ID", "Name", "Stock", "Price"];
  return (
    <div className="grid  min-h-screen">
      <nav>
        <Navigation />
      </nav>
      <main className="flex flex-col my-12">
        <TopBar />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-6 px-2">
          <MetricsCard
            title="Total Products"
            value="120"
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
            title="Revenue"
            value="Rs. 15,200"
            icon={<FaDollarSign size={20} />}
            bgColor="bg-green-500/40"
          />
          <MetricsCard
            title="Orders Today"
            value="24"
            icon={<FaShoppingCart size={20} />}
            bgColor="bg-yellow-500/40"
          />
        </div>
        <div className="px-2 mb-6 flex flex-col gap-6 items-center justify-center">
          <Table headers={headers} data={data} />
          <Table headers={headers} data={data} accent="bg-yellow-500/40" />
        </div>
      </main>
    </div>
  );
};

export default Home;
