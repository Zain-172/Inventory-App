import { useAppData } from "../context/AppDataContext";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaPlusCircle, FaUser, FaUserAlt } from "react-icons/fa";
import { lazy } from "react";
import { useAlertBox } from "../component/Alerts";
const Navigation = lazy(() => import("../component/Navigation"));
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import Modal from "../component/Modal";
const AccountForm = lazy(() => import("../component/AccountForm"));
const Metrics = lazy(() => import("../component/Metrics"));
import { useParams } from "react-router-dom";
import { fetchEmployeeAccounts, addEmployeeAccount, updateEmployeeAccount, deleteEmployeeAccount } from "../api/EmployeeAccount";

const EmployeesAccount = () => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const { loading, employees } = useAppData();
  const [accounts, setAccounts] = useState([]);
  const { alertBox } = useAlertBox();

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accounts = await fetchEmployeeAccounts();
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
      alertBox("The Employee account is deleted successfully", "Success", <FaCheckCircle />);
    } catch (err) {
      console.error("Failed to delete employee account:", err);
    } finally {
      fetchEmployeeAccounts();
    }
  };

  const handleModify = async (editedData, deleteId) => {
    try {
      await updateEmployeeAccount(deleteId, editedData);
      setAccounts((prev) => prev.map((account) => account.id === deleteId ? { ...account, ...editedData } : account));
      alertBox("The Employee account is updated successfully", "Success", <FaCheckCircle />);
    } catch (err) {
      console.error("Failed to update employee account:", err);
    } finally {
      fetchEmployeeAccounts();
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const newAccount = await addEmployeeAccount({ ...formData, employee_id: parseInt(id) });
      setAccounts((prev) => [...prev, newAccount]);
      alertBox("The Employee account is added successfully", "Success", <FaCheckCircle />);
      setOpenModal(false);
    } catch (err) {
      console.error("Failed to add employee account:", err);
    } finally {
      fetchEmployeeAccounts();
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
        <div className="px-2 my-8">
          <Metrics
            title="Employees"
            value={"Rs." + accounts.reduce((total, account) => total + (account.employee_id === parseInt(id) ? account.amount : 0), 0)}
            icon={<FaUser size={40} />}
            bgColor="bg-gradient-to-r from-green-700 to-green-400"
           />
        </div>
        <div className="px-2 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {employees.find((emp) => emp.id === parseInt(id))?.name || "Employee Account"}
          </h2>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 font-bold bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            <FaPlusCircle />
            Employee
          </button>
        </div>
        <div className="px-2 mb-8">
          <Table
            data={accounts}
            onDelete={handleDelete}
            onUpdate={handleModify}
            open={open}
            setOpen={setOpen}
            accent="bg-green-500"
          />
        </div>
      </main>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <AccountForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default EmployeesAccount;
