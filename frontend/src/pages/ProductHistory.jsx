import { useEffect, useState, useCallback, useMemo } from "react";
import DropDown from "../component/DropDown";
import { fetchProductHistory } from "../api/ProductHistory";
import { useAppData } from "../context/useAppData";
import HistoryTable from "../component/HistoryTable";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import { FaClock } from "react-icons/fa";

export default function ProductHistory() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const {
    period,
    month,
    years,
    selectedPeriod,
    setSelectedPeriod,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  } = useAppData();

  const load = () => {
    const controller = new AbortController();
    const { signal } = controller;

    fetchProductHistory(signal)
      .then((rows) => {
        const normalized = rows.map((r) => ({
          id: r.id,
          name: r.name,
          stock: Number(r.stock) || 0,
          cost_price: Number(r.cost_price) || 0,
          barcode: r.barcode,
          date: r.date,
          type: r.type,
        }));
        setData(normalized);
      })
      .catch((err) => {
        if (err && err.name === "AbortError") return;
        console.error(err);
        setData([]);
      });

    return controller;
  };

  const loadCallback = useCallback(() => load(), []);

  useEffect(() => {
    const controller = loadCallback();
    return () => controller?.abort();
  }, [loadCallback]);


  const filteredData = useMemo(() => {
    const periodValue = selectedPeriod?.value;

    return data.filter((row) => {
      const normalizedDate = String(row.date ?? "").slice(0, 10);
      if (!normalizedDate) return false;

      const historyYear = normalizedDate.slice(0, 4);
      const historyMonth = normalizedDate.slice(5, 7);

      if (periodValue === "daily") {
        return normalizedDate === selectedDate;
      }

      if (periodValue === "monthly") {
        return historyMonth === selectedMonth?.value;
      }

      if (periodValue === "annually") {
        return historyYear === selectedYear?.value;
      }

      return true;
    });
  }, [
    data,
    selectedPeriod?.value,
    selectedDate,
    selectedMonth?.value,
    selectedYear?.value,
  ]);

  return (
    <>
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <h1 className="text-2xl font-bold flex items-center py-2 gap-2">
          <FaClock />
          Product History
        </h1>
      </TopBar>
      <div className="px-4 py-20">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaClock /> Product History</h1>
        <div className="flex gap-6 w-full mb-6">
          <div className="flex flex-col font-bold gap-2 mb-4 w-full">
            <label htmlFor="history-frequency">Period:</label>
            <DropDown
              options={period}
              value={selectedPeriod}
              onChange={(data) => setSelectedPeriod(data)}
            />
          </div>
          <div className="flex flex-col font-bold gap-2 mb-4 w-full">
            <label htmlFor="history-date">
              {selectedPeriod.value === "monthly" && "Month : "}
              {selectedPeriod.value === "daily" && "Date : "}
              {selectedPeriod.value === "annually" && "Year : "}
            </label>
            {selectedPeriod.value === "monthly" && (
              <DropDown
                options={month}
                value={selectedMonth}
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
                value={selectedYear}
                onChange={(data) => setSelectedYear(data)}
              />
            )}
          </div>
        </div>
        <div>
          {filteredData && filteredData.length > 0 ? (
            <HistoryTable
              data={filteredData.map((d) => ({
                id: d.id,
                name: d.name,
                barcode: d.barcode,
                quantity: d.stock,
                price: d.cost_price,
                type: d.type,
                date: d.date,
              }))}
              open={open}
              setOpen={setOpen}
              load={load}
            />
          ) : (
            <p>No product history available for the selected period.</p>
          )}
        </div>
      </div>
    </>
  );
}
