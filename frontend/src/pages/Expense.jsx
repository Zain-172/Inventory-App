import { useState } from "react";
import Navigation from "../component/Navigation";
import Modal from "../component/Modal";
import Table from "../component/Table";
import AddExpenseForm from "../component/ExpenseForm";
import Dropdown from "../component/DropDown";

const Expense = () => {
  const [activeTab, setActiveTab] = useState("monthly");
  const [openModal, setOpenModal] = useState(false);

  // Sample Data
  const [expenseList, setExpenseList] = useState([
    { id: 1, title: "Raw Material", amount: 1200, category: "Material", date: "2025-11-26" },
    { id: 2, title: "Worker Wages", amount: 800, category: "Labor", date: "2025-11-26" },
  ]);

  const handleAddExpense = (expense) => {
    setExpenseList(prev => [
      ...prev,
      { id: prev.length + 1, ...expense }
    ]);
    setOpenModal(false);
  };


  const tableData = expenseList.map((item, index) => ({
    ID: index + 1,
    Title: item.title,
    Category: item.category,
    Amount: `Rs. ${item.amount}`,
    Date: item.date
  }));

  return (
    <div className="grid h-screen place-content-start">
      <main className="flex flex-col w-screen">

        {/* Tabs */}
        <div className="grid grid-cols-2 bg-black border-b">
          <button 
            className={`font-bold p-4 border-r border-white/50 ${activeTab === "monthly" ? "bg-yellow-500/40" : ""}`}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </button>

          <button 
            className={`font-bold p-4 ${activeTab === "daily" ? "bg-yellow-500/40" : ""}`}
            onClick={() => setActiveTab("daily")}
          >
            Daily
          </button>
        </div>

        {/* Header */}
        <div className="px-2 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Expense</h2>
          <div>

          <Dropdown className="flex items-center justify-between w-56 px-4 py-2 border border-white/40 bg-[#111] mb-2 rounded-lg" />
          </div>
        </div>

        {/* Table */}
        <div className="px-2 mb-8">
          <Table data={tableData} accent="bg-yellow-500/40" />
        </div>
        
          <button 
            onClick={() => setOpenModal(true)} 
            className="px-4 py-2 w-56 grid place-self-center bg-yellow-500/40 rounded text-white font-bold"
          >
            + Add Expense
          </button>
      </main>

      {/* Bottom Navigation */}
      <Navigation />

      {/* Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <AddExpenseForm onSubmit={handleAddExpense} />
      </Modal>
    </div>
  );
};

export default Expense;
