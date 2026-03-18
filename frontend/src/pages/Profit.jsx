import { useState, useEffect } from "react";
import { lazy } from "react";
import { Link, useNavigate } from "react-router-dom";
const Navigation = lazy(() => import("../component/Navigation"));
const TopBar = lazy(() => import("../component/TopBar"));
const DropDown = lazy(() => import("../component/DropDown"));
const Modal = lazy(() => import("../component/Modal"));
import { FaDollarSign, FaEye, FaEyeSlash, FaUsers } from "react-icons/fa";
import { useAppData } from "../context/AppDataContext";
import {
  getProfitByDate,
  getProfitByMonth,
  getProfitByYear,
} from "../api/Sale";
import { getMpinStatus, verifyMpin } from "../api/Login";

const Profit = () => {
  const navigate = useNavigate();
  const {
    loading,
    selectedPeriod,
    setSelectedPeriod,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    period,
    month,
    years,
  } = useAppData();
  const [profit, setProfit] = useState(0);
  const [isShown, setIsShown] = useState(false);
  const [mpin, setMpin] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMpinSet, setIsMpinSet] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  const storedUser = localStorage.getItem("inventory_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
      return;
    }

    const checkMpinStatus = async () => {
      try {
        const response = await getMpinStatus(user.id);
        if (response.success) {
          setIsMpinSet(response.isSet);
          if (!response.isSet) {
            setAuthMessage(
              "MPIN is not set. Please set it from your User Account page.",
            );
          }
        } else {
          setAuthMessage(response.message || "Unable to check MPIN status.");
        }
      } catch (error) {
        console.error("Failed to check MPIN status:", error);
        setAuthMessage("Unable to verify MPIN status right now.");
      }
    };

    checkMpinStatus();
  }, [navigate, user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      let totalProfit = 0;
      if (selectedPeriod.value === "daily") {
        totalProfit = await getProfitByDate(selectedDate);
      } else if (selectedPeriod.value === "monthly") {
        totalProfit = await getProfitByMonth(
          new Date().getFullYear() + "-" + selectedMonth.value,
        );
      } else if (selectedPeriod.value === "annually") {
        totalProfit = await getProfitByYear(selectedYear.value);
      }
      console.log(
        `Fetched total profit for ${selectedPeriod.value}:`,
        totalProfit,
      );
      setProfit(totalProfit);
    };
    if (
      (selectedPeriod.value === "daily" && selectedDate) ||
      (selectedPeriod.value === "monthly" && selectedMonth) ||
      (selectedPeriod.value === "annually" && selectedYear)
    ) {
      fetchData();
    }
  }, [
    isAuthenticated,
    selectedPeriod,
    selectedDate,
    selectedMonth,
    selectedYear,
  ]);

  const handleVerifyMpin = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(mpin)) {
      setAuthMessage("Enter a valid 4-digit MPIN.");
      return;
    }

    try {
      setAuthenticating(true);
      setAuthMessage("");
      const response = await verifyMpin(user.id, mpin);
      if (response.success) {
        setIsAuthenticated(true);
        setMpin("");
      } else {
        setAuthMessage(response.message || "MPIN verification failed.");
      }
    } catch (error) {
      console.error("Failed to verify MPIN:", error);
      setAuthMessage("Unable to verify MPIN right now.");
    } finally {
      setAuthenticating(false);
    }
  };

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
        <Modal isOpen={!isAuthenticated}>
          <section className="w-full max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-[0_2px_10px] shadow-black/20 p-5 mb-4">
            <h2 className="text-lg font-semibold mb-2">MPIN Authentication</h2>

            {!isMpinSet ? (
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                  {authMessage}
                </p>
                <Link
                  to="/user-account"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Go To User Account
                </Link>
              </div>
            ) : (
              <form onSubmit={handleVerifyMpin} className="space-y-3">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Enter MPIN to view profit details.
                </p>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 4-digit MPIN"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {authMessage && (
                  <p className="text-sm text-red-600">{authMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={authenticating}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {authenticating ? "Verifying..." : "Verify MPIN"}
                </button>
              </form>
            )}
          </section>
        </Modal>
        <>
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
            <div
              className={`flex flex-col justify-center p-4 rounded-xl shadow-[0_2px_10px] shadow-black/40 bg-gradient-to-r from-green-700 to-green-400 transition-colors min-h-40 mb-4`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-full text-white bg-gradient-to-r from-green-700 to-green-400 flex items-center shadow-sm shadow-black/50 justify-center mr-4 border border-white`}
                >
                  {<FaDollarSign />}
                </div>
                <p className="text-2xl font-bold text-white">Profit</p>
              </div>
              <div className="ml-20">
                <div className="flex items-center justify-between w-full ">
                  <p className="text-xl font-bold text-white">
                    {isShown ? profit : "••••"}
                  </p>
                  <button
                    className="text-white hover:text-gray-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsShown(!isShown);
                    }}
                  >
                    {isShown ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      </main>
    </div>
  );
};

export default Profit;
