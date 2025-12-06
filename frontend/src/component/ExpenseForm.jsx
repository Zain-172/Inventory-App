import { useState } from "react";
import Expense from "../models/Expense";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "./Alerts";
import { FaCheckCircle } from "react-icons/fa";
export default function ExpenseForm() {
  const [form, setForm] = useState(new Expense());
  const { setExpenses } = useAppData();
  const { alertBox } = useAlertBox();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/expense/add-expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setExpenses((prevExpenses) => [...prevExpenses, { id: data.expenseId, title: form.title, description: form.description, amount: form.amount, date: form.date }]);
      setForm(new Expense());
      alertBox("The Expense is recorded successfully", "Success", <FaCheckCircle />);
    } else {
      console.error("Failed to add expense");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#222] p-6 rounded-lg max-w-lg border border-white/30 shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Add Expense</h2>

      <label className="text-sm">Title</label>
      <input
        type="text"
        className="w-full p-2 bg-[#222] border rounded mb-3"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <label className="text-sm">Amount</label>
      <input
        type="number"
        className="w-full p-2 bg-[#222] border rounded mb-3"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        required
      />

      <label className="text-sm">Date</label>
      <input
        type="date"
        className="w-full p-2 bg-[#222] border rounded mb-4"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />
        
      <label className="text-sm">Description</label>
      <textarea
        className="w-full p-2 bg-[#222] border border-white/20 resize-none rounded mb-3"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button 
        type="submit" 
        className="w-full bg-green-500/60 text-white py-2 rounded font-bold"
      >
        Save
      </button>
    </form>
  );
}
