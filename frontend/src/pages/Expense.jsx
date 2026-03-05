import { useState } from "react";
import Navigation from "../component/Navigation";
import Daily from "./DailyExp";
import Monthly from "./MonthlyExp";
import TopBar from "../component/TopBar";
import { FaCreditCard } from "react-icons/fa";

const Expense = () => {
  const [filter, setFilter] = useState("factory");

  return (
    <div className="grid">
      <TopBar>
        <h1 className="text-2xl py-2 font-bold flex items-center justify-center gap-2"><FaCreditCard />Expense</h1>
      </TopBar>
      <main className="flex flex-col w-full my-16">
        <div className="flex items-center justify-center gap-4 py-6">
          <button className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "factory" ? "bg-green-500 text-white" : "bg-white text-green-500"}`} onClick={() => setFilter("factory")}>
            Factory Expenses
          </button>
          <button className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "home" ? "bg-green-500 text-white" : "bg-white text-green-500"}`} onClick={() => setFilter("home")}>
            Home Expenses
          </button>
          <button className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "bill" ? "bg-green-500 text-white" : "bg-white text-green-500"}`} onClick={() => setFilter("bill")}>
            Bills Expenses
          </button>
        </div>
        <div className="flex flex-col w-full">
          <Monthly filterVal={filter} />
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Expense;
