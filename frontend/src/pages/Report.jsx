import { FaBook, FaBookDead, FaBookOpen, FaBroom, FaReceipt, FaRegMoneyBillAlt, FaShoppingCart } from "react-icons/fa";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import Dropdown from "../component/DropDown";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "../component/Alerts";
import { useEffect, useState } from "react";
const Report = () => {
  const { expenses, sales } = useAppData();
  const { alertBox } = useAlertBox();
  const period = [
    { value: "daily", key: "Daily" },
    { value: "monthly", key: "Monthly" },
    { value: "annually", key: "Annually" },
  ];
  const [selectedPeriod, setSelectedPeriod] = useState(period[0]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
  ];

  const [selectedMonth, setSelectedMonth] = useState(month[0]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([]);
  useEffect(() => {
    const years = [];
    for (let i = 2025; i <= new Date().getFullYear(); i++) {
      years.push({ key: i.toString(), value: i.toString() });
    }
    setYears(years);
    setSelectedYear(years[0]);
    console.log(years);
  }, []);

  const GenerateExpensesReport = async () => {
    let filteredExpenses = [];
    let title = "Expense Report";
    if (selectedPeriod.value === "daily") {
      filteredExpenses = expenses.filter((exp) => exp.date === selectedDate);
      title = "Expense " + selectedDate;
    } else if (selectedPeriod.value === "monthly") {
      filteredExpenses = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        title = "Monthly Expense " + selectedMonth.key + " " + selectedYear.key;
        return expDate.getMonth() + 1 === parseInt(selectedMonth.value);
      });
    } else if (selectedPeriod.value === "annually") {
      filteredExpenses = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        title = "Annual Expense Report " + selectedYear.key;
        return expDate.getFullYear() === parseInt(selectedYear.value);
      });
    }
    if (filteredExpenses.length === 0) {
      await alertBox("No data found for the selected period.", "Data Not Found");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          company: "My Company",
          data: filteredExpenses.map((exp) => ({
            "#": exp.id,
            Title: exp.title,
            Date: exp.date,
            Amount: "Rs. " + exp.amount,
          })),
          total: [
            "Rs. " +
              Number(
                filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
              ),
          ],
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

  const GenerateSalesReport = async () => {
    console.log("Generating sales report...", sales );
    let filteredSales = [];
    let title = "Sales Report";
    if (selectedPeriod.value === "daily") {
      filteredSales = sales.filter((sale) => sale.sale_date === selectedDate);
      title = "Sales " + selectedDate;
    } else if (selectedPeriod.value === "monthly") {
      filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.sale_date);
        title = "Monthly Sales " + selectedMonth.key + " " + selectedYear.key;
        return saleDate.getMonth() + 1 === parseInt(selectedMonth.value);
      });
    } else if (selectedPeriod.value === "annually") {
      filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.sale_date);
        title = "Annual Sales Report " + selectedYear.key;
        return saleDate.getFullYear() === parseInt(selectedYear.value);
      });
    }
    if (filteredSales.length === 0) {
      await alertBox("No data found for the selected period.", "Data Not Found");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          company: "My Company",
          data: filteredSales.map((sale) => ({
            Invoice: sale.invoice_id,
            Salesman: sale.salesman,
            Amount: "Rs. " + sale.total_amount,
            Earnings: "Rs. " + (sale.total_amount - sale.total_cost),
          })),
          total: [
            "Rs. " +
            Number(
              filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0)
            ),
            "Rs. " +
            Number(
              filteredSales.reduce((sum, sale) => sum + (sale.total_amount - sale.total_cost), 0)
            )
          ],
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

    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const GenerateProductionReport = async () => {
    let filteredProduction = [];
    let title = "Production Report";
    if (selectedPeriod.value === "daily") {
        const res = await fetch("http://localhost:5000/product/stock-history-date?date=" + selectedDate);
        filteredProduction = await res.json();
        title = "Production " + selectedDate;
      } else if (selectedPeriod.value === "monthly") {
        const res = await fetch("http://localhost:5000/product/stock-history-month?date=" + new Date().getFullYear() + "-" + selectedMonth.value );
        filteredProduction = await res.json();
        title = "Monthly Production " + selectedMonth.key + " " + new Date().getFullYear();
    } else if (selectedPeriod.value === "annually") {
        const res = await fetch("http://localhost:5000/product/stock-history-year?date=" + selectedYear.value);
        filteredProduction = await res.json();
        title = "Annual Production Report " + selectedYear.key;
    }
    if (filteredProduction.length === 0) {
      await alertBox("No data found for the selected period.", "Data Not Found");
      return;
    }
    console.log("Filtered production: ", filteredProduction);
    try {
      const response = await fetch("http://localhost:5000/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          company: "My Company",
          data: filteredProduction.map((p, i) => ({
            "#": i + 1,
            Product: p.name,
            "Stock Added": p.stock,
            "Cost Price": "Rs. " + p.cost_price,
            Date: p.date,
          }))
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

    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const GenerateProductSaleReport = async () => {
    console.log("Generating sales report...", sales );
    let filteredSales = [];
    let title = "Sales Report";
    if (selectedPeriod.value === "daily") {
      const res = await fetch("http://localhost:5000/sale/products-sold-by-date?date=" + selectedDate);
      filteredSales = await res.json();
      title = "Sales " + selectedDate;
    } else if (selectedPeriod.value === "monthly") {
      const res = await fetch("http://localhost:5000/sale/products-sold-by-month?date=" + new Date().getFullYear() + "-" + selectedMonth.value);
      filteredSales = await res.json();
      title = "Monthly Sales " + selectedMonth.key + " " + new Date().getFullYear();
    } else if (selectedPeriod.value === "annually") {
      const res = await fetch("http://localhost:5000/sale/products-sold-by-year?date=" + selectedYear.value);
      filteredSales = await res.json();
      title = "Annual Sales " + selectedYear.key;
    }
    console.log("Filtered sales: ", filteredSales);
    if (filteredSales.length === 0) {
      await alertBox("No sales data found for the selected period.", "No Data Found !");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          company: "My Company",
          data: filteredSales.map((sale, index) => ({
            "#": index + 1,
            Product: sale.product_name,
            Salesman: sale.salesman,
            Quantity: sale.total_quantity,
            Amount: "Rs. " + sale.price * sale.total_quantity,
          })),
          total: [
            filteredSales.reduce((sum, sale) => sum + sale.total_quantity, 0),
            "Rs. " +
              Number(
                filteredSales.reduce((sum, sale) => sum + sale.price * sale.total_quantity, 0)
              ),
          ],
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

    } catch (error) {
      console.error("Error generating report:", error);
    }
  };
  return (
    <div className="grid">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <div className="text-3xl font-bold flex items-center gap-2" >
          <FaBook /> Reports
        </div>
      </TopBar>
      <main className="flex flex-col my-20">
        <div className="px-2 mb-6 flex flex-col gap-6 items-center justify-center">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-4">
            <FaBook /> Reports
          </h1>
          <div className="flex gap-6 w-full">
            <div className="flex flex-col  font-bold gap-2 mb-4 w-full">
              <label htmlFor="report-frequency">Period:</label>
              <Dropdown
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
                <Dropdown
                  options={month}
                  value={month[0]}
                  onChange={(data) => setSelectedMonth(data)}
                />
              )}
              {selectedPeriod.value === "daily" && (
                <input
                  type="date"
                  className="border p-2 rounded-lg w-full bg-[#181818]"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              )}
              {selectedPeriod.value === "annually" && (
                <Dropdown
                  options={years}
                  value={years[0]}
                  onChange={(data) => setSelectedYear(data)}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 w-full">
            <button
              onClick={GenerateSalesReport}
              className="flex flex-col items-center justify-center bg-blue-500/40 p-4 rounded-lg w-full"
            >
              <FaReceipt className="text-7xl mx-auto mb-2" />
              <h3 className="text-2xl text-center mb-2 font-bold">Generate</h3>
              <p className="text-md text-center flex gap-1">
                Sale Report
                {selectedPeriod.value === "daily" && (
                  <span className="italic font-bold">{selectedDate}</span>
                )}
                {selectedPeriod.value === "monthly" && (
                  <span className="italic font-bold">{selectedMonth.key}</span>
                )}
                {selectedPeriod.value === "annually" && (
                  <span className="italic font-bold">{selectedYear.key}</span>
                )}
              </p>
            </button>
            <button
              onClick={GenerateProductSaleReport}
              className="flex flex-col items-center justify-center bg-green-500/40 p-4 rounded-lg w-full"
            >
              <FaShoppingCart className="text-7xl mx-auto mb-2" />
              <h3 className="text-2xl text-center mb-2 font-bold">Generate</h3>
              <p className="text-md text-center flex gap-1">
                Product Sale Report
                {selectedPeriod.value === "daily" && (
                  <span className="italic font-bold">{selectedDate}</span>
                )}
                {selectedPeriod.value === "monthly" && (
                  <span className="italic font-bold">{selectedMonth.key}</span>
                )}
                {selectedPeriod.value === "annually" && (
                  <span className="italic font-bold">{selectedYear.key}</span>
                )}
              </p>
            </button>
            <button
              onClick={GenerateProductionReport}
              className="flex flex-col items-center justify-center bg-yellow-500/40 p-4 rounded-lg w-full"
            >
              <FaBroom className="text-7xl mx-auto mb-2" />
              <h3 className="text-2xl text-center mb-2 font-bold">Generate</h3>
              <p className="text-md text-center flex gap-1">
                Production Report
                {selectedPeriod.value === "daily" && (
                  <span className="italic font-bold">{selectedDate}</span>
                )}
                {selectedPeriod.value === "monthly" && (
                  <span className="italic font-bold">{selectedMonth.key}</span>
                )}
                {selectedPeriod.value === "annually" && (
                  <span className="italic font-bold">{selectedYear.key}</span>
                )}
              </p>
            </button>
            <button
              onClick={GenerateExpensesReport}
              className="flex flex-col items-center justify-center bg-red-500/40 p-4 rounded-lg w-full"
            >
              <FaRegMoneyBillAlt className="text-7xl mx-auto mb-2" />
              <h3 className="text-2xl text-center mb-2 font-bold">Generate</h3>
              <p className="text-md text-center flex gap-1">
                Expense Report
                {selectedPeriod.value === "daily" && (
                  <span className="italic font-bold">{selectedDate}</span>
                )}
                {selectedPeriod.value === "monthly" && (
                  <span className="italic font-bold">{selectedMonth.key}</span>
                )}
                {selectedPeriod.value === "annually" && (
                  <span className="italic font-bold">{selectedYear.key}</span>
                )}
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Report;
