import {
  FaBook,
  FaBookDead,
  FaBookOpen,
  FaBroom,
  FaReceipt,
  FaRegMoneyBillAlt,
  FaShoppingCart,
} from "react-icons/fa";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import DropDown from "../component/DropDown";
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
    new Date().toISOString().split("T")[0],
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
    const minimumYear = 2026;
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: Math.max(currentYear - minimumYear + 1, 0) },
      (_, i) => {
        const year = currentYear - i;
        return { key: year.toString(), value: year.toString() };
      },
    );
    setYears(years);
    setSelectedYear(years[years.length - 1]);
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
      await alertBox(
        "No data found for the selected period.",
        "Data Not Found",
      );
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
                filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
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
    console.log("Generating sales report...", sales);
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
      await alertBox(
        "No data found for the selected period.",
        "Data Not Found",
      );
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
                filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0),
              ),
            "Rs. " +
              Number(
                filteredSales.reduce(
                  (sum, sale) => sum + (sale.total_amount - sale.total_cost),
                  0,
                ),
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

  const GenerateAttendenceReport = async () => {
    let filteredAttendence = [];
    let title = "Attendance Report";
    const selectedYearValue =
      selectedYear?.value || new Date().getFullYear().toString();

    if (selectedPeriod.value === "daily") {
      console.log("Fetching attendance for date:", selectedDate);
      const res = await fetch(
        "http://localhost:5000/attendence/by-date/" + selectedDate,
      );
      filteredAttendence = await res.json();
      title = "Attendance " + selectedDate;
    } else if (selectedPeriod.value === "monthly") {
      const y = new Date().getFullYear();
      console.log("Fetching attendance for month:", selectedMonth.value);
      const res = await fetch(
        "http://localhost:5000/attendence/by-month/" +
          y +
          "-" +
          selectedMonth.value,
      );
      filteredAttendence = await res.json();
      title =
        "Monthly Attendance " + selectedMonth.key + " " + selectedYearValue;
    } else if (selectedPeriod.value === "annually") {
      console.log("Fetching attendance for year:", selectedYearValue);
      const res = await fetch(
        "http://localhost:5000/attendence/by-year/" + selectedYearValue,
      );
      filteredAttendence = await res.json();
      title = "Annual Attendance Report " + selectedYearValue;
    }
    if (filteredAttendence.length === 0) {
      await alertBox(
        "No data found for the selected period.",
        "Data Not Found",
      );
      return;
    }
    console.log("Filtered attendance: ", filteredAttendence);
    try {
      const response = await fetch(
        "http://localhost:5000/report/generate-attendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title,
            company: "My Company",
            data: filteredAttendence.map((a) => ({
              Name: a.name || a.employee_name || a.employee,
              Status: a.status,
              Date: a.date || selectedDate,
            })),
          }),
        },
      );

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
    console.log("Generating sales report...", sales);
    let filteredSales = [];
    let title = "Sales Report";
    if (selectedPeriod.value === "daily") {
      const res = await fetch(
        "http://localhost:5000/sale/products-sold-by-date?date=" + selectedDate,
      );
      filteredSales = await res.json();
      title = "Sales " + selectedDate;
    } else if (selectedPeriod.value === "monthly") {
      const res = await fetch(
        "http://localhost:5000/sale/products-sold-by-month?date=" +
          new Date().getFullYear() +
          "-" +
          selectedMonth.value,
      );
      filteredSales = await res.json();
      title =
        "Monthly Sales " + selectedMonth.key + " " + new Date().getFullYear();
    } else if (selectedPeriod.value === "annually") {
      const res = await fetch(
        "http://localhost:5000/sale/products-sold-by-year?date=" +
          selectedYear.value,
      );
      filteredSales = await res.json();
      title = "Annual Sales " + selectedYear.key;
    }
    console.log("Filtered sales: ", filteredSales);
    if (filteredSales.length === 0) {
      await alertBox(
        "No sales data found for the selected period.",
        "No Data Found !",
      );
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
                filteredSales.reduce(
                  (sum, sale) => sum + sale.price * sale.total_quantity,
                  0,
                ),
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

  const GenerateRawMaterialReport = async () => {
    let filteredRawMaterials = [];
    let title = "Raw Materials Purchasing Report";
    const selectedYearValue =
      selectedYear?.value || new Date().getFullYear().toString();

    if (selectedPeriod.value === "daily") {
      const res = await fetch(
        "http://localhost:5000/report/raw-material-purchasing-date?date=" +
          selectedDate,
      );
      filteredRawMaterials = await res.json();
      title = "Raw Materials Purchasing " + selectedDate;
    } else if (selectedPeriod.value === "monthly") {
      const res = await fetch(
        "http://localhost:5000/report/raw-material-purchasing-month?date=" +
          selectedYearValue +
          "-" +
          selectedMonth.value,
      );
      filteredRawMaterials = await res.json();
      title =
        "Monthly Raw Materials Purchasing " +
        selectedMonth.key +
        " " +
        selectedYearValue;
    } else if (selectedPeriod.value === "annually") {
      const res = await fetch(
        "http://localhost:5000/report/raw-material-purchasing-year?date=" +
          selectedYearValue,
      );
      filteredRawMaterials = await res.json();
      title = "Annual Raw Materials Purchasing " + selectedYearValue;
    }

    if (filteredRawMaterials.length === 0) {
      await alertBox(
        "No raw material purchasing data found for the selected period.",
        "No Data Found !",
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company: "My Company",
          data: filteredRawMaterials.map((item, index) => ({
            "#": index + 1,
            Name: item.name,
            Date: item.date,
            "Cost Price": "Rs. " + item.cost_price,
            Quantity: item.stock,
            Amount: "Rs. " + Number(item.amount),
          })),
          total: [
            Number(
              filteredRawMaterials.reduce(
                (sum, item) => sum + Number(item.stock || 0),
                0,
              ),
            ),
            "Rs. " +
              Number(
                filteredRawMaterials.reduce(
                  (sum, item) => sum + Number(item.amount || 0),
                  0,
                ),
              ),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating raw material report:", error);
    }
  };
  return (
    <div className="grid">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <div className="text-2xl py-2 font-bold flex items-center gap-2">
          <FaBook /> Reports
        </div>
      </TopBar>
      <main className="flex flex-col my-12 w-full p-4">
        <div className="px-2 mb-6 flex flex-col gap-6 items-center justify-center">
          <h1 className="text-3xl font-bold flex items-center justify-center py-2 gap-4">
            <FaBook /> Reports
          </h1>
          <div className="flex gap-6 w-full">
            <div className="flex flex-col font-bold gap-2 mb-4 w-full">
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
          <div className="grid grid-cols-3 gap-4 w-full">
            <button
              onClick={GenerateRawMaterialReport}
              className="flex flex-col items-center justify-center gap-2 text-white bg-gradient-to-r from-pink-700 to-pink-400 p-4 rounded-lg w-full shadow-md"
            >
              <FaRegMoneyBillAlt className="text-8xl mx-auto mb-2 bg-white rounded-full text-pink-500 p-3" />
              <h3 className="text-2xl text-center mb-2 font-bold">Generate</h3>
              <p className="text-md text-center flex gap-1">
                Raw Materials Report
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
              onClick={GenerateSalesReport}
              className="flex flex-col items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-700 to-blue-400 p-4 rounded-lg w-full shadow-md"
            >
              <FaReceipt className="text-8xl mx-auto mb-2 bg-white rounded-full text-blue-500 p-3" />
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
              className="flex flex-col items-center justify-center gap-2 text-white bg-gradient-to-r from-green-700 to-green-400 p-4 rounded-lg w-full shadow-md"
            >
              <FaShoppingCart className="text-8xl mx-auto mb-2 bg-white rounded-full text-green-500 p-3" />
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
              onClick={GenerateAttendenceReport}
              className="flex flex-col items-center justify-center gap-2 text-white bg-gradient-to-r from-yellow-700 to-yellow-400 p-4 rounded-lg w-full shadow-md"
            >
              <FaBroom className="text-8xl mx-auto mb-2 bg-white rounded-full text-yellow-500 p-3" />
              <h3 className="text-2xl text-center mb-2 font-bold">Generate</h3>
              <p className="text-md text-center flex gap-1">
                Attendence Report
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
              className="flex flex-col items-center justify-center gap-2 text-white bg-gradient-to-r from-red-700 to-red-400 p-4 rounded-lg w-full shadow-md"
            >
              <FaRegMoneyBillAlt className="text-8xl mx-auto mb-2 bg-white rounded-full text-red-500 p-3" />
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
