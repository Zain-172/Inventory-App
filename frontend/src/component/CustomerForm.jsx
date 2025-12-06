import { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "./Alerts";
import { FaCheckCircle, FaHandshake } from "react-icons/fa";

export default function CustomerForm() {
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    address: "",
    shop: "",
  });

  const { setCustomers } = useAppData();   // <-- you will store this in context
  const { alertBox } = useAlertBox();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/customer/add-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();

      // Add to context
      setCustomers((prev) => [
        ...prev,
        {
          customer_id: data.customerId,
          ...form,
        },
      ]);

      // Reset form
      setForm({
        customer: "",
        phone: "",
        address: "",
        shop: "",
      });

      alertBox(
        "Customer added successfully!",
        "Success",
        <FaCheckCircle />
      );
    } else {
      console.error("Failed to add customer");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#222] p-6 rounded-lg max-w-lg border border-white/30 shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        <FaHandshake className="inline mr-2" /> Add Customer
      </h2>

      {/* Name */}
      <label className="text-sm">Customer Name</label>
      <input
        type="text"
        className="w-full p-2 bg-[#222] border rounded mb-3"
        value={form.customer}
        onChange={(e) =>
          setForm({ ...form, customer: e.target.value })
        }
        required
      />

      {/* Phone */}
      <label className="text-sm">Phone</label>
      <input
        type="text"
        className="w-full p-2 bg-[#222] border rounded mb-3"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      {/* Address */}
      <label className="text-sm">Address</label>
      <input
        type="text"
        className="w-full p-2 bg-[#222] border rounded mb-3"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      {/* Shop Name */}
      <label className="text-sm">Shop Name</label>
      <input
        type="text"
        className="w-full p-2 bg-[#222] border rounded mb-4"
        value={form.shop}
        onChange={(e) =>
          setForm({ ...form, shop: e.target.value })
        }
      />

      <button
        type="submit"
        className="w-full bg-green-500/60 text-white py-2 rounded font-bold"
      >
        Save Customer
      </button>
    </form>
  );
}
