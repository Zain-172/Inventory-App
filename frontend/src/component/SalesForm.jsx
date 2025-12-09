import { useState } from "react";
import { FaPlus, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import Dropdown from "./DropDown";
import Table from "./Table"
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "./Alerts";

export default function SalesForm({ onSubmit }) {
  const { products, customers } = useAppData();
  const product = [
    ...products.map((item) => ({ key: item.name, value: item.id })),
  ];
  const customerOptions = customers.map((cust) => ({
    key: cust.customer,
    value: cust.id,
  }));
  const salesmen = [
    { key: "John Doe", value: "John Doe" },
    { key: "Jane Smith", value: "Jane Smith" },
    { key: "Mike Johnson", value: "Mike Johnson" },
  ];
  const [formData, setFormData] = useState({
    id: product[0].value,
    product: product[0].key,
    price: "",
    sales_price: "",
    quantity: "",
    salesman: salesmen[0],
    customer: customerOptions[0],
    date: new Date().toISOString().split("T")[0],
  });
  const [entry, setEntry] = useState([]);
  const { alertBox } = useAlertBox();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" && value < 0 || name === "price" && value < 0 || name === "sales_price" && value < 0) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoiceId = generateInvoiceId();
    if (!formData.salesman || entry.length === 0) {
      alert(
        "Please fill in all required fields and add at least one product entry."
      );
      return;
    }
    const data = {
      invoice_id: newInvoiceId,
      sale_date: formData.date,
      salesman: formData.salesman.key,
      total_cost: entry.reduce(
        (sum, i) => sum + i.quantity * products.find((p) => p.id === i.id)?.cost_price,
        0
      ),
      total_amount: entry.reduce(
        (sum, i) => sum + i.quantity * i.sale_price,
        0
      ),
      total_items: entry.reduce((sum, i) => sum + Number(i.quantity), 0),
      customer: formData.customer.value,
      items: entry,
    };
    console.log("Submitting Sale:", data);
    onSubmit && onSubmit(data);
  };
  const addEntry = () => {
    if (
      products.find((p) => p.name === formData.product)?.stock <
      Number(formData.quantity) + Number(entry.find((item) => item.product === formData.product)?.quantity || 0)
    ) {
      alertBox("Not enough stock for the selected product.");
      return;
    }
    if (formData.product && formData.quantity && formData.sales_price) {
      setEntry((prev) => {
        const exists = prev.find((item) => item.id === formData.id);

        if (exists) {
          return prev.map((item) =>
            item.id === formData.id
              ? {
                  ...item,
                  product: formData.product,
                  quantity: Number(item.quantity) + Number(formData.quantity),
                  sale_price: formData.sales_price,
                }
              : item
          );
        }

        return [
          ...prev,
          {
            id: formData.id,
            product: formData.product,
            quantity: formData.quantity,
            sale_price: formData.sales_price,
          },
        ];
      });
    }
  };

  const deleteEntry = (id) => {
    setEntry((prev) => prev.filter((item) => item.id !== id));
  };
  function generateInvoiceId() {
    const d = new Date();

    const id =
      d.getFullYear() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0") +
      String(d.getHours()).padStart(2, "0") +
      String(d.getMinutes()).padStart(2, "0") +
      String(d.getSeconds()).padStart(2, "0");

    return "INV-" + id;
  }
  const tableData = entry.map((item) => ({
    ID: item.id,
    Product: item.product,
    Quantity: item.quantity,
    Price: item.sale_price,
    Action: (
      <button
        onClick={() => deleteEntry(item.id)}
        type="button"
        className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

      <div className="flex gap-4 w-full my-4">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Salesman</label>
          <Dropdown
            options={salesmen}
            value={salesmen[0]}
            onChange={(d) => setFormData((prev) => ({ ...prev, salesman: d }))}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="1"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#181818]"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 w-full my-4">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Customer</label>
          <Dropdown
            options={customerOptions}
            value={customerOptions[0]}
            onChange={(d) => setFormData((prev) => ({ ...prev, customer: d }))}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Shop</label>
          <p
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#181818]"
          >
            {customers.find((c) => c.id === formData.customer?.value)?.shop || ""}
          </p>
        </div>
      </div>
      <div className="flex gap-4 w-full justify-center items-end mb-8">
        <div className="w-full relative">
          <label className="block text-sm font-medium mb-1">Product</label>
          <Dropdown
            options={product}
            value={product[0]}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                product: value.key,
                id: value.value,
              }))
            }
          />
          {formData.id && (
            <span className="absolute -bottom-5 left-1 text-sm text-gray-400 italic">
              Cost Price:{" "}
              {products.find((p) => p.id === formData.id)?.cost_price}
            </span>
          )}
        </div>

        <div className="w-full relative">
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="1"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#181818]"
            required
          />
          {formData.quantity >
            products.find((p) => p.id === formData.id)?.stock && (
            <span className="absolute -bottom-5 left-1 text-sm text-red-600 italic">
              *Exceeds the available stock!
            </span>
          )}
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Sales Price</label>
          <input
            type="number"
            name="sales_price"
            value={formData.sales_price}
            onChange={handleChange}
            placeholder="1"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#181818]"
            required
          />
        </div>
        <button
          onClick={addEntry}
          type="button"
          className="flex items-center justify-center p-2 mb-1 bg-green-500/40 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
        </button>
      </div>
      {entry.length > 0 ? (
        <Table
          data={tableData}
          nonEditable="Action"
        />
      ) : (
        <div className="h-20"></div>
      )}
      <button
        type="submit"
        className="w-full flex items-center mt-4 justify-center gap-2 bg-green-500/40 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaPlusCircle /> Add Sale
      </button>
    </form>
  );
}
