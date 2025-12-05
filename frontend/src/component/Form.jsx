import { useState } from "react";
import { FaCalculator, FaPlusCircle, FaWarehouse } from "react-icons/fa";
import RawMaterial from "../models/RawMaterial";
export default function Form({ onSubmit }) {
  const [formData, setFormData] = useState(new RawMaterial());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ID: 5,
      Material: formData.name,
      Cost_Price:
        Number(formData.price) + Number(formData.machinery) + Number(formData.labour),
      Date: formData.date,
      Description: formData.description,
    }
    console.log("Submitting:", formData);
    const res = await fetch("http://localhost:5000/raw-material/add-raw-material", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    console.log(result);
    onSubmit && onSubmit(data);
    setFormData(new RawMaterial());
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <h2 className="text-3xl font-semibold text-center mb-4 flex justify-center items-end gap-4">
        <FaWarehouse size={36} />
        Production Cost
      </h2>
      <div className="flex gap-4 w-full">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Material</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Material X"
            className="w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">
            No of Items *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || 0}
            onChange={handleChange}
            placeholder="100"
            className="w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price || 0}
            onChange={handleChange}
            placeholder="200"
            className="w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Machinery *</label>
          <input
            type="number"
            name="machinery"
            value={formData.machinery || 0}
            onChange={handleChange}
            placeholder="200"
            className="w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Labour *</label>
          <input
            type="number"
            name="labour"
            value={formData.labour || 0}
            onChange={handleChange}
            placeholder="Material X"
            className="w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            name="date_added"
            value={formData.date_added || ""}
            onChange={handleChange}
            placeholder="100"
            className="w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Material X"
            className="w-full px-3 py-2 rounded-md focus:outline-none bg-[#111] border border-white/20 resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex items-center mt-4 justify-center gap-2 bg-green-500/40 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        <FaCalculator /> Calculate
      </button>
    </form>
  );
}
