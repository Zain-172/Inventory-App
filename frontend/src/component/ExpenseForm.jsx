import { useState } from "react";
import Expense from "../models/Expense";

export default function AddExpenseForm({ onSubmit }) {
  const [form, setForm] = useState(new Expense());

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = fetch("http://localhost:5000/expense/add-expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      onSubmit(form);
    } else {
      console.error("Failed to add expense");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#222] p-6 rounded-lg max-w-lg border border-white/30 shadow-lg"
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
        required
      />

      <button 
        type="submit" 
        className="w-full bg-yellow-500/60 text-white py-2 rounded font-bold"
      >
        Save
      </button>
    </form>
  );
}
