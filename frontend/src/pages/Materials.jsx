import { useState } from "react";
import Navigation from "../component/Navigation";
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import {
  FaBroom,
  FaCheckCircle,
  FaCalculator,
  FaPlusCircle,
  FaExclamationTriangle,
  FaTrashAlt,
  FaMinus,
  FaMinusCircle,
} from "react-icons/fa";
import Modal from "../component/Modal";
import { Link } from "react-router-dom";
import DropDown from "../component/DropDown";
import { useAppData } from "../context/AppDataContext";
import Product from "../models/Product";
import { useAlertBox } from "../component/Alerts";
import Trie from "../component/Trie";

const Material = () => {
  const [open, setOpen] = useState(false);
  const { products, setProducts, loading, fetchProducts } = useAppData();
  const [filter, setFilter] = useState("production");
  const [formData, setFormData] = useState({
    name: "",
    cost_price: "",
    stock: "",
    date: new Date().toISOString().split("T")[0],
    type: filter,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const { alertBox } = useAlertBox();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, type: filter, action: "ADD" };
    console.log("Form Data: ", data);
    try {
      const res = await fetch("http://localhost:5000/product/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alertBox(
          "The Product is added successfully",
          "Success",
          <FaCheckCircle />,
        );
        fetchProducts();
        setFormData(new Product());
      } else {
        alertBox(
          "Failed to add product: Insufficient Raw Materials or Invalid Data",
          "Error",
          <FaExclamationTriangle />,
        );
      }
    } catch (err) {
      console.log("Error: ", err);
    }
    setIsModalOpen(false);
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    if (
      formData.stock >
      products.find((product) => product.name === formData.name)?.stock
    ) {
      alert("Cannot remove more stock than available!");
      return;
    }
    const data = new Product(
      0,
      formData.name,
      formData.cost_price,
      -formData.stock,
      formData.date,
      filter,
    );
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
        alertBox(
          "The Product stock is removed successfully",
          "Success",
          <FaCheckCircle />,
        );
        fetchProducts();
        setRemoveModal(false);
        setFormData(new Product());
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
        setProducts((prevData) =>
          prevData.filter((product) => product.id !== id),
        );
        alertBox(
          "The Product is deleted successfully",
          "Success",
          <FaCheckCircle />,
        );
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
    <div className="grid h-screen place-content-start">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <h1 className="text-2xl py-2 font-bold flex items-center justify-center gap-2">
          <FaBroom />
          Products
        </h1>
      </TopBar>
      <main className="flex flex-col my-16 w-screen">
        <div className="flex items-center justify-center gap-4 py-6">
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "raw" ? "bg-green-600 text-white" : "text-green-500"}`}
            onClick={() => setFilter("raw")}
          >
            Raw Materials
          </button>
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "production" ? "bg-green-600 text-white" : "text-green-500"}`}
            onClick={() => setFilter("production")}
          >
            Production Made
          </button>
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "ready" ? "bg-green-600 text-white" : "text-green-500"}`}
            onClick={() => setFilter("ready")}
          >
            Ready Made
          </button>
        </div>
        <div className="px-2 py-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {filter === "raw"
                ? "Raw Materials"
                : filter === "production"
                  ? "Production Made"
                  : "Ready Made"}
            </h2>
            <div className="flex items-center justify-center gap-4">
              {filter == "production" && (
                <Link
                  to="/cost-calculator"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2"
                >
                  <FaCalculator /> Calculate Cost
                </Link>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2"
              >
                <FaPlusCircle /> Add Stock
              </button>

              <button
                onClick={() => setRemoveModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2"
              >
                <FaTrashAlt /> Remove Stock
              </button>
            </div>
          </div>
          <Table
            open={open}
            setOpen={setOpen}
            data={products
              .filter((product) => product.type === filter && product.stock > 0)
              .map((product) => ({
                id: product.id,
                name: product.name,
                barcode: product.barcode,
                cost_price: product.cost_price,
                stock: product.stock,
                date: product.date,
              }))}
            onDelete={handleDelete}
            nonEditable="Delete"
            accent="bg-green-600"
          />
        </div>
      </main>
      <Modal
        isOpen={isModalOpen && filter !== "production"}
        onClose={() => setIsModalOpen(false)}
        title="Add New Material"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 flex flex-col w-[50vw]"
        >
          <h2 className="flex items-center justify-center text-2xl font-bold mb-6 gap-2">
            <FaBroom />
            Stock
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Name</label>
              <Trie
                items={products.map((product) => product.name)}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: value.key,
                    cost_price: products.find((prod) => prod.name === value.key)?.cost_price || "",
                  }))
                }
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">
                Price
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full">
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Type</label>
              <div className="flex justify-between items-center w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-black dark:border-white">
                <span>
                  {filter === "raw" && "Raw Material"}
                  {filter === "ready" && "Ready Made"}
                </span>
              </div>
            </div>
            <div className="w-full col-span-2">
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaPlusCircle /> Add Stock
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isModalOpen && filter === "production"}
        onClose={() => setIsModalOpen(false)}
        title="Add New Material"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 flex flex-col w-[50vw]"
        >
          <h2 className="flex items-center justify-center text-2xl font-bold mb-6 gap-2">
            <FaBroom />
            Stock
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Name</label>
              <DropDown
                className="flex justify-between items-center w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-black dark:border-white"
                options={products
                  .filter((product) => product.type === "production")
                  .map((product) => ({
                    key: product.name,
                    value: product.cost_price,
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
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">
                Price
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full">
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Type</label>
              <div className="flex justify-between items-center w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-black dark:border-white">
                <span>Production</span>
              </div>
            </div>
            <div className="w-full col-span-2">
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
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
          className="bg-white rounded-lg p-6 flex flex-col gap-4 border border-black w-[50vw]"
        >
          <h2 className="flex items-center justify-center text-2xl font-bold mb-6 gap-2">
            <FaBroom />
            Stock
          </h2>
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Name</label>
            <DropDown
              options={products.map((product) => ({ key: product.name, value: product.id }))}
              onChange={(data) =>
                setFormData((prev) => ({
                  ...prev,
                  name: data.key,
                  id: data.value,
                  cost_price: products.find((prod) => prod.id === data.value)?.cost_price || "",
                }))
              }
            />
          </div>
          <div className="w-full relative">
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
            {formData.stock >
              products.find((product) => product.name === formData.name)
                ?.stock && (
              <span className="absolute -bottom-4 left-1 text-[10px] text-red-600 italic">
                *The Quantity exceeds the available stock!
              </span>
            )}
          </div>
          <div className="w-full">
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-2 focus:ring-blue-500 mb-4"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaMinusCircle /> Remove Stock
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Material;
