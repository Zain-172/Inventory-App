import { useState } from "react";
import Navigation from "../component/Navigation";
import Modal from "../component/Modal";
import Table from "../component/Table";
import AddExpenseForm from "../component/ExpenseForm";
import { useAppData } from "../context/AppDataContext";
import Expense from "../models/Expense";
import { useAlertBox } from "../component/Alerts";

const Daily = () => {
  const [openModal, setOpenModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { loading, expenses, setExpenses, fetchExpenses } = useAppData();
  const [open, setOpen] = useState(false);
  const { alertBox } = useAlertBox();

  const handleDelete = async (id) => {
    console.log("Deleting expense with id:", id);
    try {
      const response = await fetch(`http://localhost:5000/expense/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
        alertBox("The Expense is deleted successfully", "Success", <FaCheckCircle />);
      } else {
        console.error("Failed to delete expense");
      }
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  }

  const handleModify = async (editedData, deleteId) => {
    const res = await fetch(`http://localhost:5000/expense/${deleteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(new Expense(editedData))
    });
    if (res.ok) {
      fetchExpenses();
      alertBox("The Expense is modified successfully", "Success", <FaCheckCircle />);
    } else {
      console.error("Failed to modify");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid w-full">
      <main className="flex flex-col w-full">
        <div className="px-2 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Expense</h2>
          <div>

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex items-center justify-between px-4 py-2 border border-white/40 bg-[#111] mb-2 rounded-lg" />
          </div>
        </div>

        <div className="px-2 mb-8 w-full">
          <Table data={expenses.filter(item => item.date === date)} accent="bg-green-500/40" open={open} setOpen={setOpen} onDelete={handleDelete} onUpdate={handleModify} />
        </div>

          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 w-56 grid place-self-center bg-green-500/40 rounded text-white font-bold"
          >
            + Add Expense
          </button>
      </main>

      <Navigation />

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <AddExpenseForm onChange={() => setOpen(false)} />
      </Modal>
    </div>
  );
};

export default Daily;
