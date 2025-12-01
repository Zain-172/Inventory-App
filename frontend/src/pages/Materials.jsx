import { useState } from "react";
import Navigation from "../component/Navigation";
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import { FaBroom, FaCalculator, FaPlusCircle } from "react-icons/fa";
import Modal from "../component/Modal";
import Form from "../component/Form";
import { Link } from "react-router-dom";
import Dropdown from "../component/DropDown";

const Material = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    stock: 0,
    cost_price: 0,
    sale_price: 0,
  });
  const [data, setData] = useState([
        { id: 1, name: "Material X", stock: 100, cost_price: 200, sale_price: 1000 },
        { id: 2, name: "Material Y", stock: 50,  cost_price: 500, sale_price: 1000 },
        { id: 3, name: "Material Z", stock: 0,   cost_price: 800, sale_price: 1000 },
    ]);
  const options = [
    {key: "A", value: 1000},
    {key: "B", value: 2000},
    {key: "C", value: 3000}
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="grid h-screen place-content-start" onClick={() => setOpen(false)}>
      <nav>
        <Navigation />
      </nav>
      <main className="flex flex-col my-12 w-screen">
        <TopBar screen="Inventory" />
        <div className="px-2 py-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">Inventory</h2>
                <div className="flex gap-4">
                  <button onClick={() => setIsModalOpen(true)} className="mb-4 px-4 py-2 bg-green-500/40 text-white rounded font-bold flex items-center gap-2"><FaPlusCircle /> Stock</button>
                  <Link to="/cost-calculator" className="mb-4 px-4 py-2 bg-green-500/40 text-white rounded font-bold flex items-center gap-2"><FaCalculator /> Calculate Cost</Link>
                </div>
            </div>
          <Table open={open} setOpen={setOpen} data={data} accent="bg-green-500/40" />
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Material">
        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); setData((prev) => [...prev, { id: 4, ...formData }])}} className="bg-[#222] rounded-lg p-6 flex flex-col border border-white/40 w-96">
          <h2 className="flex items-center justify-center text-2xl font-bold mb-6 gap-2"><FaBroom />Stock</h2>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <Dropdown
              className="flex justify-between items-center w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500 border-white/40"
              options={options}
              onChange={(d) =>
                setFormData((prev) => ({
                  ...prev,
                  name: d.key,
                  cost_price: d.value
                }))
              }
            />
          </div>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">
              Cost Price
            </label>
            <input
              type="number"
              name="costPrice"
              value={formData.cost_price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cost_price: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stock: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-500/40 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <FaPlusCircle /> Add Stock
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Material;
