import { useAppData } from "../context/useAppData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaUser,
  FaUserAlt,
  FaPencilAlt,
  FaEllipsisV,
  FaTrashAlt
} from "react-icons/fa";
import { lazy } from "react";
import { useAlertBox } from "../component/useAlertBox";
const Navigation = lazy(() => import("../component/Navigation"));
const Table = lazy(() => import("../component/Table"));
const TopBar = lazy(() => import("../component/TopBar"));
const Modal = lazy(() => import("../component/Modal"));
const AccountForm = lazy(() => import("../component/AccountForm"));
const Metrics = lazy(() => import("../component/Metrics"));
const MessageBox = lazy(() => import("../component/MessageBox"));
const EmployeeForm = lazy(() => import("../component/EmployeeForm"));
import { useParams } from "react-router-dom";
import {
  fetchEmployeeAccounts,
  addEmployeeAccount,
  updateEmployeeAccount,
  deleteEmployeeAccount,
} from "../api/EmployeeAccount";

const EmployeesAccount = () => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [DropDownOpen, setDropDownOpen] = useState(false);
  const { loading, employees, fetchEmployees } = useAppData();
  const [accounts, setAccounts] = useState([]);
  const { alertBox } = useAlertBox();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accounts = await fetchEmployeeAccounts(id);
        setAccounts(accounts);
      } catch (err) {
        console.error("Failed to load employee accounts:", err);
      }
    };
    loadAccounts();
  }, [id]);
  const handleDelete = async (id) => {
    try {
      await deleteEmployeeAccount(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
      alertBox(
        "The Employee account is deleted successfully",
        "Success",
        <FaCheckCircle />,
      );
    } catch (err) {
      console.error("Failed to delete employee account:", err);
    } finally {
      fetchEmployeeAccounts(id);
    }
  };

  const handleModify = async (editedData, deleteId) => {
    try {
      await updateEmployeeAccount(deleteId, editedData);
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === deleteId ? { ...account, ...editedData } : account,
        ),
      );
      alertBox(
        "The Employee account is updated successfully",
        "Success",
        <FaCheckCircle />,
      );
    } catch (err) {
      console.error("Failed to update employee account:", err);
    } finally {
      fetchEmployeeAccounts(id);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const newAccount = await addEmployeeAccount({
        ...formData,
        employee_id: parseInt(id),
      });
      setAccounts((prev) => [...prev, newAccount]);
      alertBox(
        "The Employee account is added successfully",
        "Success",
        <FaCheckCircle />,
      );
      setOpenModal(false);
    } catch (err) {
      console.error("Failed to add employee account:", err);
    } finally {
      fetchEmployeeAccounts(id);
    }
  };

  const handleEmployeeModify = async (editedData, deleteId) => {
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
      await fetchEmployees();
      setIsModifyOpen(false);
    } else {
      console.error("Failed to modify");
    }
  };
  const handleEmployeeDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/employee/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alertBox(
          "The Employee is deleted successfully",
          "Success",
          <FaCheckCircle />,
        );
        navigate("/employee");
      } else {
        console.error("Failed to delete employee");
      }
    } catch (err) {
      console.error("Failed to delete employee:", err);
    }
    setOpenModal(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  return (
    <div className="grid" onClick={() => setDropDownOpen(false)}>
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
        <div className="px-2 my-8">
          <Metrics
            title="Employees"
            value={
              "Rs." +
              accounts.reduce(
                (total, account) =>
                  total +
                  (account.employee_id === parseInt(id) ? account.amount : 0),
                0,
              )
            }
            icon={<FaUser size={40} />}
            bgColor="bg-gradient-to-r from-green-700 to-green-400"
          />
        </div>
        <div className="px-2 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {employees.find((emp) => emp.id === parseInt(id))?.name ||
              "Employee Account"}
          </h2>
          <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 font-bold bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <FaPlusCircle />
            Employee
          </button>

          <div className="flex justify-end">
            <button
              className={`p-2 rounded-lg hover:bg-green-700 bg-green-600 text-white`}
              onClick={(e) => {
                e.stopPropagation();
                setDropDownOpen((prev) => !prev);
              }}
            >
              <FaEllipsisV />
            </button>
            {DropDownOpen && (
              <div className="absolute right-0 mt-10 w-40 bg-[#111] border border-white/40 text-white rounded-lg shadow-lg flex flex-col">
                <button
                  className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 font-bold rounded-t-lg border-b border-white/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
              >
                <FaTrashAlt />
                Delete
              </button>
              <button
                className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 font-bold rounded-b-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModifyOpen(true);
                }}
              >
                <FaPencilAlt />
                Modify
              </button>
              {isOpen && (
                <MessageBox
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  message="Delete"
                  onConfirm={() => handleEmployeeDelete(id)}
                >
                  <div className="w-[300px] mb-2">
                    <h2 className="text-xl font-bold flex items-center justify-center gap-2 w-full mb-4">
                      <FaTrashAlt />
                      DELETE
                    </h2>
                    <p className="text-center text-sm">
                      Do you want to delete this <strong>Employee</strong> from
                      your employee records?.
                    </p>
                  </div>
                </MessageBox>
              )}
            </div>
            )}
          </div>
            </div>
        </div>
        <div className="px-2 mb-8">
          <Table
            data={accounts}
            onDelete={handleDelete}
            onUpdate={handleModify}
            open={open}
            setOpen={setOpen}
            accent="bg-green-600"
          />
        </div>
      </main>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <AccountForm onSubmit={handleSubmit} />
      </Modal>
      <Modal isOpen={isModifyOpen} onClose={() => setIsModifyOpen(false)}>
        <EmployeeForm onSubmit={(data) => handleEmployeeModify(data, id)} modifyData={employees.find((emp) => emp.id === parseInt(id))} />
      </Modal>
    </div>
  );
};

export default EmployeesAccount;
