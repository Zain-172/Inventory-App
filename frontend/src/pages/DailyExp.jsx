import { useState } from "react";
import Navigation from "../component/Navigation";
import Modal from "../component/Modal";
import Table from "../component/Table";
import AddExpenseForm from "../component/ExpenseForm";
import { useAppData } from "../context/AppDataContext";

const Daily = () => {
  const [openModal, setOpenModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { loading, expenses } = useAppData();


  const tableData = expenses.map((item) => ({
    ID: item.id,
    Title: item.title,
    Description: item.description,
    Amount: `Rs. ${item.amount}`,
    Date: item.date
  }));

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid w-full">
      <main className="flex flex-col w-full">
        <div className="px-2 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Expense</h2>
          <div>

          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex items-center justify-between px-4 py-2 border border-white/40 bg-[#111] mb-2 rounded-lg" />
          </div>
        </div>

        <div className="px-2 mb-8 w-full">
          <Table data={tableData.filter(item => item.Date === date)} accent="bg-yellow-500/40" />
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
        <AddExpenseForm />
      </Modal>
    </div>
  );
};

export default Daily;
