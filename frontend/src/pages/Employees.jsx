import Table from "../component/Table";
import { useAppData } from "../context/useAppData";
import { useState } from "react";
import { FaCheckCircle, FaPlusCircle, FaUserAlt } from "react-icons/fa";
import { useAlertBox } from "../component/useAlertBox";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import Modal from "../component/Modal";
import EmployeeForm from "../component/EmployeeForm";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const { loading, employees, setEmployees } = useAppData();
  const { alertBox } = useAlertBox();

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
        <FaCheckCircle />,
      );
    } else {
      console.error("Failed to add employee");
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
            className="flex items-center gap-2 font-bold bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <FaPlusCircle /> Employee
          </button>
        </div>
        <div className="px-2 mb-8">
          {employees.length === 0 ? (
            <p className="text-center text-gray-500">No employees found.</p>
          ) : (
          <table className="min-w-full border rounded-lg overflow-hidden  ">
            <thead className="text-sm font-medium uppercase">
              <tr>
                {Object.keys(employees[0]).map((key, index) => (
                  <th key={index} className="px-4 py-2 border text-left">
                    {key === "Action"
                      ? ""
                      : key.toUpperCase().replaceAll("_", " ")}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y" onClick={(e) => e.stopPropagation()}>
              {employees.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border"
                  onClick={() => {
                    navigate(`/account/${row.id}`);
                  }}
                >
                  {Object.keys(row).map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border p-0 bg-green-600 ${
                        colIndex == 0 ? "w-6" : ""
                      }`}
                    >
                      {colIndex ? (
                        <p className="p-2 min-w-[150px]">{row[col]}</p>
                      ) : (
                        <p className="text-center w-8">{row[col]}</p>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </main>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <EmployeeForm onSubmit={handleSubmit} modifyData={{name: "", position: "", salary: "", phone: "", address: ""}} />
      </Modal>
    </div>
  );
};

export default Employees;
