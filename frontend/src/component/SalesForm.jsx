import { useState } from "react";
import { FaPlus, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import DropDown from "./DropDown";
import Table from "./Table"
import Trie from "./Trie";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "./Alerts";

export default function SalesForm({ onSubmit }) {
  const { products, customers, employees } = useAppData();
  const product = [
    ...products.filter((item) => item.stock > 0 && item.type !== "raw").map((item) => ({ key: item.name, value: item.barcode })),
  ];
  const customerOptions = customers.map((cust) => ( { key: cust.customer, value: cust.id } ));
  const paymentStatusOptions = [
    { key: "Paid", value: "paid" },
    { key: "Pending", value: "pending" },
    { key: "Half Payment", value: "half_payment" },
  ];
  const deliveryStatusOptions = [
    { key: "Not Delivered", value: "not_delivered" },
    { key: "Delivered", value: "delivered" },
  ];
  const salesmen = [
    ...employees.filter((emp) => emp.position.toLowerCase() === "salesman").map((emp) => ({ key: emp.name, value: emp.id })),
  ];
  const [formData, setFormData] = useState({
    id: product[0]?.value,
    product: product[0]?.key,
    price: "",
    sales_price: "",
    quantity: "",
    tax: "0",
    status: paymentStatusOptions[0],
    delivery_status: deliveryStatusOptions[0],
    salesman: salesmen[0],
    customer: customerOptions[0],
    date: new Date().toISOString().split("T")[0],
  });
  const [entry, setEntry] = useState([]);
  const { alertBox } = useAlertBox();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" && value < 0 || name === "price" && value < 0 || name === "sales_price" && value < 0 || name === "tax" && value < 0) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoiceId = generateInvoiceId();
    if (!formData.salesman || entry.length === 0 || !formData.customer) {
      alert(
        "Please fill in all required fields and add at least one product entry."
      );
      return;
    }
    const subtotal = entry.reduce(
      (sum, i) => sum + i.quantity * i.sale_price,
      0,
    );
    const taxAmount = Number(formData.tax) || 0;
    console.log("Form Data:", formData);
    const data = {
      invoice_id: newInvoiceId,
      sale_date: formData.date,
      salesman: formData.salesman.key,
      total_cost: entry.reduce(
        (sum, i) => sum + i.quantity * products.find((p) => p.barcode === i.id)?.cost_price,
        0
      ),
      total_amount: subtotal,
      tax: taxAmount,
      status: formData.status.value,
      delivery_status: formData.delivery_status.value,
      total_items: entry.reduce((sum, i) => sum + Number(i.quantity), 0),
      customer: formData.customer.key,
      customer_id: formData.customer.value,
      items: entry,
    };
    console.log("Submitting Sale:", data);
    onSubmit && onSubmit(data);
  };
  const addEntry = () => {
    if (
      products.find((p) => p.barcode === formData.id)?.stock <
      Number(formData.quantity) + Number(entry.find((item) => item.id === formData.id)?.quantity || 0)
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
    Barcode: item.id,
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
      className="bg-white border border-white/40 p-6 rounded-xl shadow-[0px_0px_10px] shadow-white/20 w-[90vw] max-w-4xl max-h-screen overflow-y-auto"
    >
      <h2 className="text-3xl font-semibold text-center">Sales</h2>

      <div className="flex gap-4 w-full my-4">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Salesman</label>
          <DropDown
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            required
          />
        </div>
      </div>

      <div className="flex gap-4 w-full my-4">
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Customer</label>
          <Trie
            items={customerOptions}
            value={formData.customer}
            onChange={(d) => {setFormData((prev) => ({ ...prev, customer: d })); console.log("Selected customer:", d);}}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Status</label>
          <DropDown
            options={paymentStatusOptions}
            value={paymentStatusOptions[0]}
            onChange={(d) => setFormData((prev) => ({ ...prev, status: d }))}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Delivery</label>
          <DropDown
            options={deliveryStatusOptions}
            value={deliveryStatusOptions[0]}
            onChange={(d) => setFormData((prev) => ({ ...prev, delivery_status: d }))}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Tax</label>
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>
      <div className="flex gap-4 w-full justify-center items-end mb-8">
        <div className="w-full relative">
          <label className="block text-sm font-medium mb-1">Product</label>
          <Trie
            items={product}
            value={formData.product}
            onChange={(d) => {
              setFormData((prev) => ({ ...prev, product: d.key, id: d.value }));
              console.log("Selected product:", d);
            }}
          />
          {formData.id && (
            <span className="absolute -bottom-5 left-1 text-sm text-gray-400 italic">
              Price:{" "}
              {products.find((p) => p.barcode === formData.id)?.cost_price}
            </span>
          )}
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Barcode</label>
          <div
            className="w-full px-3 py-2 border rounded-lg dark:border-white/20 border-black"
          >
            {formData.id || "--"}
          </div>
        </div>
        <div className="w-full relative">
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="1"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            required
          />
          {formData.quantity >
            products.find((p) => p.barcode === formData.id)?.stock && (
            <span className="absolute -bottom-5 left-1 text-[10px] text-red-600 italic">
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            required
          />
        </div>
        <button
          onClick={addEntry}
          type="button"
          className="flex items-center justify-center p-2 mb-1 bg-green-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        className="w-full flex items-center mt-4 justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaPlusCircle /> Add Sale
      </button>
    </form>
  );
}
