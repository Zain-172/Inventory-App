import { useState } from "react";
import { FaBook, FaSave } from "react-icons/fa";

export default function KhataForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    opening_balance: 0,
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      opening_balance: Number(form.opening_balance) || 0,
    });
  };

  return (
    <form
      className="flex flex-col items-center bg-white p-6 rounded-xl w-[55vw] border border-white/30 shadow-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
        <FaBook /> Khata Account
      </h2>
      <div className="flex items-center gap-4 w-full">
        <label className="block mb-2 w-full">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg mt-1"
          />
        </label>

        <label className="block mb-2 w-full">
          <span className="text-sm font-medium">Phone</span>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </label>
      </div>
      <div className="flex items-center gap-4 w-full">
        <label className="block mb-2 w-full">
          <span className="text-sm font-medium">Opening Balance</span>
          <input
            type="number"
            name="opening_balance"
            value={form.opening_balance}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </label>

        <label className="block mb-2 w-full">
          <span className="text-sm font-medium">Address</span>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg mt-1"
          />
        </label>
      </div>

      <label className="block mb-3 w-full">
        <span className="text-sm font-medium">Note</span>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border rounded-lg mt-1 resize-none"
        />
      </label>

      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800"
      >
        <FaSave /> Save Khata
      </button>
    </form>
  );
}
