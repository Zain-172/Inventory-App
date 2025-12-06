import { useState } from "react";
import { FaSave, FaUserAlt } from "react-icons/fa";

export default function EmployeeForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    position: "",
    salary: "",
    phone: "",
    address: ""
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
    <form className="flex flex-col items-center bg-[#202020] p-6 rounded-xl w-[55vw] border border-white/30 shadow-lg" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2"><FaUserAlt /> Employee</h2>
      <div className="flex items-center gap-4 w-full">
      {/* Name */}
      <label className="block mb-2 w-full">
        <span className="text-sm font-medium">Name</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mt-1"
        />
      </label>

      {/* Designation */}
      <label className="block mb-2 w-full">
        <span className="text-sm font-medium">Position</span>
        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mt-1"
        />
      </label>
      </div>
      <div className="flex items-center gap-4 w-full">
      {/* Salary */}
      <label className="block mb-2 w-full">
        <span className="text-sm font-medium">Salary</span>
        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mt-1"
        />
      </label>

      {/* Phone */}
      <label className="block mb-2 w-full">
        <span className="text-sm font-medium">Phone</span>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
        />
      </label>
      </div>
      {/* Address */}
      <label className="block mb-3 w-full">
        <span className="text-sm font-medium">Address</span>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border rounded mt-1 resize-none"
        />
      </label>

      {/* Submit */}
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-green-600/40 text-white rounded hover:bg-green-800"
      >
        <FaSave /> Employee
      </button>
    </form>
  );
}
