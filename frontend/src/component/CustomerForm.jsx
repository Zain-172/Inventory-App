import { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "./Alerts";
import { FaCheckCircle, FaHandshake } from "react-icons/fa";

export default function CustomerForm() {
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    address: "",
    type: "",
    ntn: "",
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
        type: "",
        ntn: "",
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
      className="bg-white p-6 rounded-lg w-[45vw] grid grid-cols-2 gap-2 border border-white/30 shadow-lg"
    >
      <h2 className="text-xl font-bold text-center col-span-2">
        <FaHandshake className="inline mr-2" /> Customer
      </h2>

      {/* Name */}
      <label className="text-sm">Customer Name
      <input
        type="text"
        className="w-full p-2 bg-white border rounded-lg mb-2"
        value={form.customer}
        onChange={(e) =>
          setForm({ ...form, customer: e.target.value })
        }
        required
      />
      </label>
      {/* Phone */}
      <label className="text-sm">Phone
      <input
        type="text"
        className="w-full p-2 bg-white border rounded-lg mb-2"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      </label>

      {/* Address */}
      <label className="text-sm">NTN
      <input
        type="text"
        className="w-full p-2 bg-white border rounded-lg mb-2"
        value={form.ntn}
        onChange={(e) => setForm({ ...form, ntn: e.target.value })}
      />
      </label>

      {/* type Name */}
      <label className="text-sm">Type
      <input
        type="text"
        className="w-full p-2 bg-white border rounded-lg mb-2"
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      />
      </label>

      {/* Address */}
      <label className="text-sm col-span-2">Address
      <textarea
        className="w-full p-2 bg-white border rounded-lg mb-2"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      </label>

      <button
        type="submit"
        className="w-full bg-green-600 col-span-2 text-white py-2 rounded-lg font-bold"
      >
        Save Customer
      </button>
    </form>
  );
}
