import { FaBook } from "react-icons/fa";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import Dropdown from "../component/DropDown";
import { useAppData } from "../context/AppDataContext";
import { useEffect, useState } from "react";
const Report = () => {
  const { expenses } = useAppData();
  const period = [{ value: "daily", key: "Daily" }, { value: "monthly", key: "Monthly" }, { value: "annually", key: "Annually" }];
  const [selectedPeriod, setSelectedPeriod] = useState(period[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const month = [
    { key: "January", value: "01" },
    { key: "February", value: "02" },
    { key: "March", value: "03" },
    { key: "April", value: "04" },
    { key: "May", value: "05" },
    { key: "June", value: "06" },
    { key: "July", value: "07" },
    { key: "August", value: "08" },
    { key: "September", value: "09" },
    { key: "October", value: "10" },
    { key: "November", value: "11" },
    { key: "December", value: "12" },
  ]

  const [selectedMonth, setSelectedMonth] = useState(month[0]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([]);
  useEffect(() => {
    const years = [];
    for (let i = 2025; i <= new Date().getFullYear();  i++) {
      years.push({ key: i.toString(), value: i.toString() });
    }
    setYears(years);
    setSelectedYear(years[0]);
    console.log(years);
  }, []);

  const handleGenerateReport = async () => {
    try {
      const response = await fetch("http://localhost:5000/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Expense of " + new Date().toISOString().split("T")[0],
          company: "My Company",
          data: expenses.filter(exp => exp.date === new Date().toISOString().split("T")[0]).map(exp => ({
            "#": exp.id,
            Title: exp.title,
            Date: exp.date,
            Amount: exp.amount,
          })),
          total: ["Rs. " + Number(expenses.filter(exp => exp.date === new Date().toISOString().split("T")[0]).reduce((sum, exp) => sum + exp.amount, 0))],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // ✅ Convert response to Blob
      const blob = await response.blob();

      // ✅ Create object URL
      const url = window.URL.createObjectURL(blob);

      // ✅ Open PDF in a new tab
      window.open(url);

      // Optionally, you could embed it in an <iframe> in Electron:
      // document.getElementById("pdfPreview").src = url;
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="grid">
      <nav>
        <Navigation />
      </nav>
      <main className="flex flex-col my-16">
        <TopBar screen="Reports" />
        <div className="px-2 mb-6 flex flex-col gap-6 items-center justify-center">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-4">
            <FaBook /> Reports
          </h1>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex flex-col items-center justify-center bg-green-500/40 font-bold py-2 px-4 rounded-lg w-full">
              <h3 className="text-2xl text-center">Sale Reports</h3>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-frequency" className="w-20">
                  Period:
                </label>
                <Dropdown options={period} value={period[0]} onChange={(data) => setSelectedPeriod(data)} />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-date" className="w-20">
                { selectedPeriod.value === "monthly" && "Month : "}
                { selectedPeriod.value === "daily" && "Date : "}
                { selectedPeriod.value === "annually" && "Year : "}
                </label>
                { selectedPeriod.value === "monthly" && <Dropdown options={month} value={month[0]} onChange={(data) => setSelectedMonth(data)} />}
                { selectedPeriod.value === "daily" && <input type="date" className="border p-2 rounded-lg w-full" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />}
                { selectedPeriod.value === "annually" && <Dropdown options={years} value={years[0]} onChange={(data) => setSelectedYear(data)} />}
              </div>
              <button className="bg-white text-[#222] border py-1 px-6 rounded ">
                Generate
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-green-500/40 font-bold py-2 px-4 rounded w-full">
              <h3 className="text-2xl text-center">Sale Reports</h3>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-frequency" className="w-20">
                  Period:
                </label>
                <Dropdown options={period} value={period[0]} onChange={(data) => setSelectedPeriod(data)} />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-date" className="w-20">
                  Date:
                </label>
                <Dropdown options={month} value={month[0]} />
              </div>
              <button className="bg-white text-[#222] border py-1 px-6 rounded ">
                Generate
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-green-500/40 font-bold py-2 px-4 rounded w-full">
              <h3 className="text-2xl text-center">Sale Reports</h3>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-frequency" className="w-20">
                  Period:
                </label>
                <Dropdown options={period} value={period[0]} onChange={(data) => setSelectedPeriod(data)} />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-date" className="w-20">
                  Date:
                </label>
                <Dropdown options={month} value={month[0]} />
              </div>
              <button className="bg-white text-[#222] border py-1 px-6 rounded ">
                Generate
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-green-500/40 font-bold py-2 px-4 rounded w-full">
              <h3 className="text-2xl text-center">Sale Reports</h3>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-frequency" className="w-20">
                  Period:
                </label>
                <Dropdown options={period} value={period[0]} onChange={(data) => setSelectedPeriod(data)} />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-date" className="w-20">
                  Date:
                </label>
                <Dropdown options={month} value={month[0]} />
              </div>
              <button className="bg-white text-[#222] border py-1 px-6 rounded ">
                Generate
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-green-500/40 font-bold py-2 px-4 rounded w-full">
              <h3 className="text-2xl text-center">Sale Reports</h3>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-frequency" className="w-20">
                  Period:
                </label>
                <Dropdown options={period} value={period[0]} onChange={(data) => setSelectedPeriod(data)} />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-date" className="w-20">
                  Date:
                </label>
                <Dropdown options={month} value={month[0]} />
              </div>
              <button className="bg-white text-[#222] border py-1 px-6 rounded ">
                Generate
              </button>
            </div>
            <div className="flex flex-col items-center justify-center bg-green-500/40 font-bold py-2 px-4 rounded w-full">
              <h3 className="text-2xl text-center">Sale Reports</h3>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-frequency" className="w-20">
                  Period:
                </label>
                <Dropdown options={period} value={period[0]} onChange={(data) => setSelectedPeriod(data)} />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <label htmlFor="report-date" className="w-20">
                  Date:
                </label>
                <Dropdown options={month} value={month[0]} />
              </div>
              <button
                onClick={handleGenerateReport}
                className="bg-white text-[#222] border py-1 px-6 rounded "
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Report;
