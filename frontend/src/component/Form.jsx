import { useState } from "react";
import { FaCalculator, FaPlus, FaTrashAlt, FaWarehouse } from "react-icons/fa";
import DropDown from "./DropDown";
import Table from "./Table";
import { useAppData } from "../context/AppDataContext";
export default function Form({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    date: new Date().toISOString().split("T")[0],
    quantity: "",
  });
  const [entry, setEntry] = useState({ id: "", name: "", quantity: "" });
  const [raw, setRaw] = useState([]);
  const { products } = useAppData();

  const deleteEntry = (id) => {
    setEntry((prev) => ({ ...prev, quantity: "", name: "" }));
    setRaw((prev) => prev.filter((item) => item.id !== id));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = () => {
    console.log(entry);
    if (entry.name && entry.quantity && entry.quantity < products.find((p) => p.id === entry.id)?.stock) {
      setRaw((prev) => [
        ...(prev || []),
        {
          ...entry,
          action: (
            <button
              onClick={() => deleteEntry(entry.id)}
              type="button"
              className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaTrashAlt />
            </button>
          ),
        },
      ]);
      setEntry({ id: "", name: "", quantity: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!onSubmit) return;

    const payload = {
      form_data: {
        name: formData.name,
        cost_price: Number(formData.price || 0),
        stock: Number(formData.quantity || 0),
        date: formData.date,
        type: "production",
      },
      raw_materials: raw.map((item) => ({
        raw_id: Number(item.id),
        quantity: Number(item.quantity),
      })),
    };

    const isSaved = await onSubmit(payload);
    if (isSaved) {
      setFormData({
        name: "",
        price: "",
        date: new Date().toISOString().split("T")[0],
        quantity: "",
      });
      setRaw([]);
      setEntry({ id: "", name: "", quantity: "" });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-lg w-full border border-white/30 shadow-md shadow-white/10 mb-16"
      >
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
              placeholder="Material Name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">
              No of Items Produced*
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity || 0}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="100"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div className="flex gap-4 w-full items-center">
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">
              Raw Material *
            </label>
            <DropDown
              options={products
                .filter((product) => product.type === "raw")
                .map((product) => ({ key: product.name, value: product.id }))}
              onChange={(d) =>
                setEntry((prev) => ({
                  ...prev,
                  id: d.value,
                  name: d.key,
                }))
              }
              value={entry.name}
            />
          </div>

          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">
              No of Items Used *
            </label>
            <input
              type="number"
              name="quantity"
              value={entry.quantity}
              onChange={handleEntryChange}
              placeholder="200"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            { entry.quantity > products.find((p) => p.id === entry.id)?.stock && (
              <p className="text-[10px] text-red-600 mt-1">
                Exceeds available stock: {products.find((p) => p.id === entry.id)?.stock}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddEntry}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
          >
            <FaPlus />
          </button>
        </div>
        <Table data={raw} />
        <button
          type="submit"
          className="w-full flex items-center mt-4 justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaCalculator /> Calculate
        </button>
      </form>
    </>
  );
}
