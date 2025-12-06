import Table from "../component/Table";
import { useAppData } from "../context/AppDataContext";
import { useState } from "react";
import { FaCheckCircle, FaPlusCircle, FaUserAlt } from "react-icons/fa";
import { useAlertBox } from "../component/Alerts";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import Modal from "../component/Modal";
import EmployeeForm from "../component/EmployeeForm";

const Employees = () => {
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const { loading, employees, setEmployees } = useAppData();
  const { alertBox } = useAlertBox();
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/employee/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== id)
        );
        alertBox(
          "The Employee is deleted successfully",
          "Success",
          <FaCheckCircle />
        );
      } else {
        console.error("Failed to delete employee");
      }
    } catch (err) {
      console.error("Failed to delete employee:", err);
    }
    setOpenModal(false);
  };

  const handleSubmit = async (data) => {
    const res = await fetch("http://localhost:5000/employee/add-employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newEmployee = await res.json();
      setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
      alertBox(
        "The Employee is added successfully",
        "Success",
        <FaCheckCircle />
      );
    } else {
      console.error("Failed to add employee");
    }
  };
  const handleModify = async (editedData, deleteId) => {
    console.log(editedData);
    const res = await fetch(`http://localhost:5000/employee/${deleteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedData),
    });
    if (res.ok) {
      alertBox(
        "The Employee is modified successfully",
        "Success",
        <FaCheckCircle />
      );
    } else {
      console.error("Failed to modify");
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  return (
    <div className="grid">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <div className="flex items-center gap-4 py-2 text-2xl font-bold">
          <FaUserAlt />
          Employees
        </div>
      </TopBar>
      <main className="flex flex-col my-16 w-screen">
        <div className="px-2 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Employees</h2>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 font-bold bg-green-500/40 text-white px-4 py-2 rounded"
          >
            <FaPlusCircle /> Employee
          </button>
        </div>
        <div className="px-2 mb-8">
          <Table
            data={employees}
            onDelete={handleDelete}
            onUpdate={handleModify}
            open={open}
            setOpen={setOpen}
            accent="bg-green-500/40"
          />
        </div>
      </main>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <EmployeeForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default Employees;
