import Navigation from "../component/Navigation";
import Modal from "../component/Modal";
import Table from "../component/Table";
import AddExpenseForm from "../component/ExpenseForm";
import Dropdown from "../component/DropDown";
import Expense from "../models/Expense";
import { useAppData } from "../context/AppDataContext";
import { useState } from "react";

const Monthly = () => {
  const [openModal, setOpenModal] = useState(false);
  const { loading, expenses, setExpenses } = useAppData();
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
  const [selectedMonth, setSelectedMonth] = useState(month[new Date().getMonth()].key);
  const [open, setOpen] = useState(false);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/expense/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
      } else {
        console.error("Failed to delete expense");
      }
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  }

  const handleModify = async (editedData, deleteId) => {
    console.log(editedData)
    const res = await fetch(`http://localhost:5000/expense/${deleteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(new Expense(editedData))
    });
    if (res.ok) {
      console.log("Modified successfully");
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

          <Dropdown options={month} className="flex items-center justify-between w-56 px-4 py-2 border border-white/40 bg-[#111] mb-2 rounded-lg" value={month.find(m => m.key === selectedMonth)} onChange={(value) => setSelectedMonth(value.key)} />
          </div>
        </div>

        <div className="px-2 mb-8">
          <Table data={expenses.filter(item => item.date.startsWith(`2025-${month.find(m => m.key === selectedMonth)?.value}`))} onDelete={handleDelete} accent="bg-yellow-500/40" open={open} setOpen={setOpen} onUpdate={handleModify} />
        </div>

          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 w-56 grid place-self-center bg-yellow-500/40 rounded text-white font-bold"
          >
            + Add Expense
          </button>
      </main>

      <Navigation />

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <AddExpenseForm />
      </Modal>
    </div>
  );
};

export default Monthly;
