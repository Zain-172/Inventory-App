import { useState } from "react";
import Navigation from "../component/Navigation";
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import { FaBroom, FaCalculator, FaEllipsisV, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import Modal from "../component/Modal";
import { Link } from "react-router-dom";
import Dropdown from "../component/DropDown";
import { useAppData } from "../context/AppDataContext";
import Product from "../models/Product";

const Material = () => {
  const [open, setOpen] = useState(false);
  const { rawMaterials, products, setProducts, loading } = useAppData();
  const [openMenuIndex, setOpenMenuIndex] = useState(false);
  const [formData, setFormData] = useState(new Product());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, action: "ADD" };
    try {
      const res = await fetch("http://localhost:5000/product/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        console.error("Failed to add product:", result.message);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
    setIsModalOpen(false);
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    if (formData.stock > products.find(product => product.name === formData.name)?.stock) {
      alert("Cannot remove more stock than available!");
      return;
    }
    const data = new Product(0, formData.name, formData.cost_price, -formData.stock, formData.date);
    data.action = "REMOVE";
    try {
      const res = await fetch("http://localhost:5000/product/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        console.error("Failed to add product:", result.message);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/product/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProducts((prevData) => prevData.filter((product) => product.id !== id));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className="grid h-screen place-content-start"
      onClick={() => setOpenMenuIndex(false)}
    >
      <nav>
        <Navigation />
      </nav>
      <main className="flex flex-col my-12 w-screen">
        <TopBar screen="Inventory" />
        <div className="px-2 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">Inventory</h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Link
                to="/cost-calculator"
                className="px-4 py-2 bg-green-500/40 text-white rounded font-bold flex items-center gap-2"
              >
                <FaCalculator /> Calculate Cost
              </Link>

                <button
                  className="py-3 px-2 rounded bg-green-500/40 hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuIndex((prev) => !prev);
                  }}
                >
                  <FaEllipsisV />
                </button>
                {openMenuIndex && (
                  <div className="absolute right-0 mt-32 w-48 bg-[#111] border border-white/40 text-white rounded-lg shadow-lg flex flex-col">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2  hover:bg-green-500/40 text-white rounded-t border-b font-bold flex items-center gap-2"
                    >
                      <FaPlusCircle /> Add Stock
                    </button><button
                      onClick={() => setRemoveModal(true)}
                      className="px-4 py-2  hover:bg-green-500/40 text-white rounded-b font-bold flex items-center gap-2"
                    >
                      <FaTrashAlt /> Remove Stock
                    </button>
                  </div>
                )}
            </div>
          </div>
          <Table
            open={open}
            setOpen={setOpen}
            data={products}
            onDelete={handleDelete}
            accent="bg-green-500/40"
          />
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Material"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-[#222] rounded-lg p-6 flex flex-col border border-white/40 w-96"
        >
          <h2 className="flex items-center justify-center text-2xl font-bold mb-6 gap-2">
            <FaBroom />
            Stock
          </h2>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <Dropdown
              className="flex justify-between items-center w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500 border-white/40"
              options={rawMaterials.map((material) => ({
                key: material.name,
                value: material.cost_price,
              }))}
              onChange={(d) =>
                setFormData((prev) => ({
                  ...prev,
                  name: d.key,
                  cost_price: d.value,
                }))
              }
            />
          </div>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Cost Price</label>
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
            <label className="block text-sm font-medium mb-1">Quantity</label>
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
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: e.target.value,
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
      
      <Modal
        isOpen={removeModal}
        onClose={() => setRemoveModal(false)}
        title="Remove Stock"
      >
        <form
          onSubmit={handleRemove}
          className="bg-[#222] rounded-lg p-6 flex flex-col border border-white/40 w-96"
        >
          <h2 className="flex items-center justify-center text-2xl font-bold mb-6 gap-2">
            <FaBroom />
            Stock
          </h2>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <Dropdown
              className="flex justify-between items-center w-full px-3 py-2 border rounded-md focus:outline-none bg-[#111] focus:ring-2 focus:ring-blue-500 border-white/40"
              options={rawMaterials.map((material) => ({
                key: material.name,
                value: material.cost_price,
              }))}
              onChange={(d) =>
                setFormData((prev) => ({
                  ...prev,
                  name: d.key,
                  cost_price: d.value,
                }))
              }
            />
          </div>
          <div className="w-full mb-4 relative">
            <label className="block text-sm font-medium mb-1">Quantity</label>
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
            { formData.stock > products.find(product => product.name === formData.name)?.stock && 
            (<span className="absolute -bottom-4 left-1 text-[10px] text-red-600 italic">
              *The Quantity exceeds the available stock!
            </span>
            ) }
          </div>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: e.target.value,
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
