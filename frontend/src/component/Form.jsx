import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Dropdown from "./DropDown";
export default function Form({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    price: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(formData);
    setFormData({ name: "", stock: "", price: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#181818] border border-white/40 p-6 rounded-xl shadow-[0px_0px_10px] shadow-white/20 w-[90vw] max-w-3xl">
      <h2 className="text-3xl font-semibold text-center mb-4">Production</h2>
      <div className="flex gap-4 w-full">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Material</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Material X"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="100"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Price (Rs.)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="200"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <Dropdown className="w-full px-3 py-2 border border-white/20 bg-[#222] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                  optionClassName="bg-[#181818] px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-400 transition-colors"
          label="Category" options={["Raw Material", "Finished Product", "Consumable"]} onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))} />
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Material</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Material X"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="100"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex items-center mt-4 justify-center gap-2 bg-green-500/40 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        <FaPlusCircle /> Material
      </button>
    </form>
  );
}
