import { useState } from "react";
import { FaSave, FaUserAlt } from "react-icons/fa";

export default function EmployeeForm({ onSubmit }) {
  const [form, setForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0], // default to today
    reason: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form); // send to parent or API
  };

  return (
    <form className="flex flex-col items-center bg-white p-6 rounded-xl w-[55vw] border border-white/30 shadow-lg" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2"><FaUserAlt /> Employee</h2>

      <div className="flex items-center gap-4 w-full">
      {/* Salary */}
      <label className="block mb-2 w-full">
        <span className="text-sm font-medium">Payment</span>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg mt-1"
        />
      </label>

      {/* Phone */}
      <label className="block mb-2 w-full">
        <span className="text-sm font-medium">Date</span>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg mt-1"
        />
      </label>
      </div>
      {/* Address */}
      <label className="block mb-3 w-full">
        <span className="text-sm font-medium">Reason</span>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border rounded-lg mt-1 resize-none"
        />
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800"
      >
        <FaSave /> Payment
      </button>
    </form>
  );
}
