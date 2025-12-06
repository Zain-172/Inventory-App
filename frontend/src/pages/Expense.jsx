import { useState } from "react";
import Navigation from "../component/Navigation";
import Daily from "./DailyExp";
import Monthly from "./MonthlyExp";

const Expense = () => {
  const [activeTab, setActiveTab] = useState("monthly");

  return (
    <div className="grid">
      <main className="flex flex-col w-full">
        <div className="grid grid-cols-2 bg-black border-b">
          <button
            className={`font-bold p-4 border-r border-white/50 ${activeTab === "monthly" ? "bg-green-500/40" : ""} text-center`}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </button>

          <button
            className={`font-bold p-4 ${activeTab === "daily" ? "bg-green-500/40" : ""} text-center`}
            onClick={() => setActiveTab("daily")}
          >
            Daily
          </button>
        </div>
        <div className="flex flex-col w-full">
          {activeTab === "monthly" ? <Monthly /> : <Daily />}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Expense;
