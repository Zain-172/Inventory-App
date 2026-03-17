import { useState, useEffect } from "react";
import { lazy } from "react";
const Navigation = lazy(() => import("../component/Navigation"));
const TopBar = lazy(() => import("../component/TopBar"));
const Metrics = lazy(() => import("../component/Metrics"));
const DropDown = lazy(() => import("../component/DropDown"));
import { FaDollarSign, FaUsers } from "react-icons/fa";
import { useAppData } from "../context/AppDataContext";
import { getProfitByDate, getProfitByMonth, getProfitByYear } from "../api/Sale";

const Profit = () => {
  const { loading, selectedPeriod, setSelectedPeriod, selectedDate, setSelectedDate, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, period, month, years } = useAppData();
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let totalProfit = 0;
      if (selectedPeriod.value === "daily") {
        totalProfit = await getProfitByDate(selectedDate);
      } else if (selectedPeriod.value === "monthly") {
        totalProfit = await getProfitByMonth(new Date().getFullYear() + "-" + selectedMonth.value);
      } else if (selectedPeriod.value === "annually") {
        totalProfit = await getProfitByYear(selectedYear.value);
      }
      console.log(`Fetched total profit for ${selectedPeriod.value}:`, totalProfit);
      setProfit(totalProfit);
    };
    if ((selectedPeriod.value === "daily" && selectedDate) ||
        (selectedPeriod.value === "monthly" && selectedMonth) ||
        (selectedPeriod.value === "annually" && selectedYear)) {
      fetchData();
    }
  }, [selectedPeriod, selectedDate, selectedMonth, selectedYear]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  return (
    <div className="grid">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <h1 className="text-2xl font-bold flex items-center py-2 gap-2">
          <FaDollarSign />
          Profit
        </h1>
      </TopBar>
      <main className="flex flex-col my-16 w-full p-4">
        <div className="flex gap-6 w-full">
          <div className="flex flex-col  font-bold gap-2 mb-4 w-full">
            <label htmlFor="report-frequency">Period:</label>
            <DropDown
              options={period}
              value={period[0]}
              onChange={(data) => setSelectedPeriod(data)}
            />
          </div>
          <div className="flex flex-col font-bold gap-2 mb-4 w-full">
            <label htmlFor="report-date">
              {selectedPeriod.value === "monthly" && "Month : "}
              {selectedPeriod.value === "daily" && "Date : "}
              {selectedPeriod.value === "annually" && "Year : "}
            </label>
            {selectedPeriod.value === "monthly" && (
              <DropDown
                options={month}
                value={month[0]}
                onChange={(data) => setSelectedMonth(data)}
              />
            )}
            {selectedPeriod.value === "daily" && (
              <input
                type="date"
                className="border p-2 rounded-lg w-full bg-white"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}
            {selectedPeriod.value === "annually" && (
              <DropDown
                options={years}
                value={years[years.length - 1]}
                onChange={(data) => setSelectedYear(data)}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Metrics
            title="Profit"
            value={profit}
            icon={<FaDollarSign />}
            bgColor="bg-gradient-to-l from-blue-400 to-blue-600"
          />
        </div>
      </main>
    </div>
  );
};

export default Profit;
