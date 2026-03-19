import Navigation from "../component/Navigation";
import Modal from "../component/Modal";
import Table from "../component/Table";
import ExpenseForm from "../component/ExpenseForm";
import Expense from "../models/Expense";
import DropDown from "../component/DropDown";
import { useAppData } from "../context/AppDataContext";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaArrowsAltH } from "react-icons/fa";
import { useAlertBox } from "../component/Alerts";

const Monthly = ({ filterVal = "factory" }) => {
  const [openModal, setOpenModal] = useState(false);
  const { loading, expenses, setExpenses, fetchExpenses, selectedDate, setSelectedDate, selectedPeriod, setSelectedPeriod, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, period, month, years } = useAppData();
  const [open, setOpen] = useState(false);
  const { alertBox } = useAlertBox();

  useEffect(() => {
    console.log("Selected month changed to:", expenses);
  }, [expenses]);

  const matchesPeriod = (expenseDate) => {
    const normalizedDate = String(expenseDate ?? "").slice(0, 10);
    if (!normalizedDate) return false;

    const expenseYear = normalizedDate.slice(0, 4);
    const expenseMonth = normalizedDate.slice(5, 7);

    if (selectedPeriod.value === "daily") {
      return normalizedDate === selectedDate;
    }

    if (selectedPeriod.value === "monthly") {
      return expenseMonth === selectedMonth.value;
    }

    if (selectedPeriod.value === "annually") {
      return expenseYear === selectedYear.value;
    }

    return true;
  };

  const filteredExpenses = expenses.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const matchesCategory =
      filterVal === "all" ||
      title.includes(filterVal) ||
      (filterVal === "factory" && title.includes("salary"));

    return matchesCategory && matchesPeriod(item.date);
  });

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/expense/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense.id !== id),
        );
        alertBox(
          "The Expense is deleted successfully",
          "Success",
          <FaCheckCircle />,
        );
      } else {
        console.error("Failed to delete expense");
      }
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const handleModify = async (editedData, deleteId) => {
    console.log(editedData);
    const res = await fetch(`http://localhost:5000/expense/${deleteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new Expense(editedData)),
    });
    if (res.ok) {
      fetchExpenses();
      alertBox(
        "The Expense is modified successfully",
        "Success",
        <FaCheckCircle />,
      );
    } else {
      console.error("Failed to modify");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid w-full">
      <main className="flex flex-col w-full">
        <div className="px-2 py-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <h2 className="text-2xl font-bold">
            {filterVal === "all"
              ? "All Expenses"
              : filterVal === "factory"
                ? "Factory Expenses"
                : filterVal === "home"
                  ? "Home Expenses"
                  : filterVal === "bill"
                    ? "Utility Bills"
                    : ""}
          </h2>
          <div className="flex gap-6 w-full">
            <div className="flex flex-col  font-bold gap-2 mb-4 w-full">
              <label htmlFor="report-frequency">Period:</label>
              <DropDown
                options={period}
                value={selectedPeriod}
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
        </div>

        <div className="px-2 mb-8">
          <Table
            data={filteredExpenses}
            onDelete={handleDelete}
            accent="bg-green-600"
            open={open}
            setOpen={setOpen}
            onUpdate={handleModify}
          />
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 w-56 grid place-self-center bg-green-600 rounded-lg text-white font-bold"
        >
          + Add Expense
        </button>
      </main>

      <Navigation />

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <ExpenseForm onSubmit={() => setOpenModal(false)} />
      </Modal>
    </div>
  );
};

export default Monthly;
