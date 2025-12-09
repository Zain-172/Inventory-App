import { useState } from "react";
import Expense from "../models/Expense";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "./Alerts";
import { FaCheckCircle, FaWarehouse } from "react-icons/fa";
import TrieSearch from "./Trie";
export default function MaterialForm() {
  const [form, setForm] = useState(new Expense());
  const { setMaterials } = useAppData();
  const { alertBox } = useAlertBox();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/material/add-material", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setMaterials((prevMaterials) => [
        ...prevMaterials,
        {
          id: data.materialId,
          title: form.title,
          description: form.description,
          amount: form.amount,
          date: form.date,
        },
      ]);
      setForm(new Expense());
      alertBox(
        "The Expense is recorded successfully",
        "Success",
        <FaCheckCircle />
      );
    } else {
      console.error("Failed to add expense");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#181818] p-6 rounded-lg w-[50vw] border border-white/30 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-center flex items-center gap-2 justify-center"><FaWarehouse /> Material</h2>

      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm">Title
        <TrieSearch
          onChange={(value) => setForm({ ...form, title: value })}
        />
        </label>
        <label className="text-sm">Amount
        <input
          type="number"
          className="w-full p-2 bg-[#181818] border rounded-lg mb-3"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        </label>
      </div>
      <label className="text-sm">Date</label>
      <input
        type="date"
        className="w-full p-2 bg-[#181818] border rounded-lg mb-4"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />

      <label className="text-sm">Description</label>
      <textarea
        className="w-full p-2 bg-[#181818] border border-white/20 resize-none rounded-lg mb-3"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button
        type="submit"
        className="w-full bg-green-500/60 text-white py-2 rounded-lg font-bold"
      >
        Save
      </button>
    </form>
  );
}
