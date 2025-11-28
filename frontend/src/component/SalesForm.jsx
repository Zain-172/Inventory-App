import { useState, useRef } from "react";
import { FaPlus, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import Dropdown from "./DropDown";
import Table from "./Table";
import Modal from "./Modal";
import Receipt from "./Receipt";

export default function SalesForm({ onSubmit }) {
  const product = [
    {product: "Product A", price: 100},
    {product: "Product B", price: 200},
    {product: "Product C", price: 300},
  ]
  const receiptRef = useRef(null);
  const [formData, setFormData] = useState({
    product: "",
    price: "",
    quantity: "",
    salesman: "Default Salesman",
    date: new Date().toISOString().split("T")[0],
  });
  const [entry, setEntry] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(formData);

    setIsModalOpen(true);
  };
    const addEntry = () => {
    if (formData.product && formData.quantity) {
      setEntry((prev) => [
        ...prev,
        { id: Date.now(), product: formData.product, quantity: formData.quantity, price: formData.price },
      ]);
    }
  };

  const deleteEntry = (id) => {
    setEntry((prev) => prev.filter((item) => item.id !== id));
  };

  const tableData = entry.map((item, index) => ({
    ID: index + 1,
    Product: item.product,
    Quantity: item.quantity,
    Price: item.price,
    Action: (
      <button
        onClick={() => deleteEntry(item.id)}
        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        <FaTrashAlt />
      </button>
    ),
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#181818] border border-white/40 p-6 rounded-xl shadow-[0px_0px_10px] shadow-white/20 w-[90vw] max-w-3xl max-h-screen overflow-y-auto"
    >
      <h2 className="text-3xl font-semibold text-center">Sales</h2>

      <div className="flex gap-4 w-full justify-center items-end mb-4">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Product</label>
          <Dropdown options={product.map(p => p.product)} value={formData.product} onChange={(value) => setFormData((prev) => ({ ...prev, product: value, price: product.find(p => p.product === value)?.price || 0 }))} />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="1"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={addEntry}
          type="button"
          className="flex items-center justify-center p-2 mb-1 bg-blue-500/40 text-white rounded-sm hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
        </button>
      </div>
      <div className="flex gap-4 w-full my-4">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Salesman</label>
          <Dropdown options={["1", "2", "3"]} />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="1"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      { entry.length > 0 ? <Table data={tableData} headers={["Product", "Quantity", "Price", "Action"]} /> : <div className="h-24"></div> }
      <button
        type="submit"
        className="w-full flex items-center mt-4 justify-center gap-2 bg-blue-500/40 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        <FaPlusCircle /> Add Sale
      </button>
      <Modal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} title="Sales Receipt">
        <Receipt ref={receiptRef} saleData={{date: formData.date, salesman: formData.salesman, items: entry }} />
      </Modal>
    </form>
  );
}
