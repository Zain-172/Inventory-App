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
const Home = () => {
  return (
    <div className="grid grid-cols-[70px_1fr] min-h-screen">
      <nav>
        <Navigation />
      </nav>
      <main className="flex flex-col">
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
        <div className="px-2">
          <Table />
        </div>
      </main>
    </div>
  );
};

export default Home;
