import Table from "../component/Table";
import { useAppData } from "../context/AppDataContext";
import { useState } from "react";
import { FaCheckCircle, FaHandshake, FaPlusCircle } from "react-icons/fa";
import { useAlertBox } from "../component/Alerts";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import Modal from "../component/Modal";
import CustomerForm from "../component/CustomerForm";

const Customer = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { loading, customers, setCustomers, fetchCustomers } = useAppData();
  const { alertBox } = useAlertBox();
  const handleSubmit = async (data) => {
    const res = await fetch("http://localhost:5000/customer/add-customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newCustomer = await res.json();
      setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
      alertBox(
        "The Customer is added successfully",
        "Success",
        <FaCheckCircle />
      );
    } else {
      console.error("Failed to add customer");
    }
  };
  const handleModify = async (editedData, deleteId) => {
    console.log(editedData);
    try {
      const res = await fetch(`http://localhost:5000/customer/${deleteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });
      if (res.ok) {
        fetchCustomers();
        alertBox(
          "The Customer is modified successfully",
          "Success",
          <FaCheckCircle />
        );
      } else {
        console.error("Failed to modify customer");
      }
    } catch (error) {
      console.error("Failed to modify customer", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/customer/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.id !== id)
        );
        alertBox(
          "The Customer is deleted successfully",
          "Success",
          <FaCheckCircle />
        );
      } else {
        console.error("Failed to delete customer");
      }
    } catch (err) {
      console.error("Failed to delete customer:", err);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <div className="flex items-center gap-4 py-2 text-2xl font-bold">
          <FaHandshake />
          Customers
        </div>
      </TopBar>
      <main className="flex flex-col my-16 w-screen">
        <div className="px-2 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Customers</h2>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 font-bold bg-green-500/40 text-white px-4 py-2 rounded-lg"
          >
            <FaPlusCircle /> Customer
          </button>
        </div>
        <div className="px-2 mb-8">
          <Table
            data={customers}
            onDelete={handleDelete}
            onUpdate={handleModify}
            open={open}
            setOpen={setOpen}
            accent="bg-green-500/40"
          />
        </div>
      </main>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <CustomerForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default Customer;
