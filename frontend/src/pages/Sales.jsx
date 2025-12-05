import { useState } from "react";
import Navigation from "../component/Navigation";
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import { FaCheckCircle, FaEllipsisV, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import Modal from "../component/Modal";
import Form from "../component/SalesForm";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "../component/Alerts";
import MessageBox from "../component/MessageBox";

const Sales = () => {
  const { alertBox } = useAlertBox();
  const [open, setOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const { salesWithItems, setSalesWithItems, setInventory, loading } = useAppData();

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/sale/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSalesWithItems((prevData) => prevData.filter((sale) => sale.id !== id));
        alertBox("The Sale is deleted successfully", "Success", <FaCheckCircle />);
      } else {
        console.error("Failed to delete sale");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
    setOpenMenuIndex(null);
    setIsMessageBoxOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = async (data) => {
    const res = await fetch("http://localhost:5000/sale/add-sale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSalesWithItems((prevData) => [...prevData, data]);
      setInventory((prevData) => {
        const updatedInventory = { ...prevData };
        data.items.forEach((item) => {
          if (updatedInventory[item.id]) {
            updatedInventory[item.id].stock -= item.quantity;
          }
        });
        console.log("Updated Inventory after Sale:", updatedInventory);
        return updatedInventory;
      });
    } else {
      console.error("Failed to add sale");
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  return (
    <div className="grid" onClick={() => setOpenMenuIndex(null)}>
      <nav>
        <Navigation />
      </nav>
      <main className="flex flex-col my-12 w-full">
        <TopBar screen="Sales" />
        <div className="px-2 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">Sales & Purchase</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-4 px-4 py-2 bg-blue-500/40 text-white rounded font-bold flex items-center gap-2"
            >
              <FaPlusCircle /> Sale Items
            </button>
          </div>
          <hr className="mb-4" />
          {salesWithItems.map((group, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 mb-2">
                <p className="text-lg">
                  <strong>Invoice:</strong> {group.invoice_id}
                </p>
                <div className="flex justify-end">
                  <button className="p-2 rounded bg-blue-500/40 hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuIndex(openMenuIndex === index ? null : index);
                  }}
                  >
                    <FaEllipsisV />
                  </button>
                  {openMenuIndex === index && (
                  <div className="absolute right-0 mt-10 w-40 bg-[#111] border border-white/40 text-white rounded-lg shadow-lg flex flex-col">
                    <button
                      className="flex items-center justify-center gap-2 hover:bg-gray-700 px-4 py-2 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMessageBoxOpen(true);
                      }}
                    >
                      <FaTrashAlt />
                      Delete
                    </button>
                    {isMessageBoxOpen && openMenuIndex === index && <MessageBox isOpen={isMessageBoxOpen} onClose={() => setIsMessageBoxOpen(false)} message="Delete" onConfirm={() => handleDelete(group.id)}>
                      <div className="w-[300px] mb-2">
                        <h2 className="text-xl font-bold flex items-center justify-center gap-2 w-full mb-4"><FaTrashAlt />DELETE</h2>
                        <p className="text-center text-sm" >
                          Do you want to delete this <strong>Sale Record</strong> from your sales records?. <br /> <strong> Warning: </strong> If you delete this the quantity is added to stock.
                        </p>
                      </div>
                    </MessageBox>}
                  </div>
                )}
                </div>
                <p className="text-lg">
                  <strong>Salesman:</strong> {group.salesman}
                </p>
                <p className="text-lg text-right">
                  <strong>Date:</strong> {group.sale_date}
                </p>
              </div>
              <Table
                open={open}
                setOpen={setOpen}
                data={group.items}
                accent="bg-blue-500/40"
              />
              <div className="flex justify-between items-center my-4">
                <p className="text-lg font-bold">
                  Total Items: {group.total_items}
                </p>
                <p className="text-lg font-bold">
                  Total Price: {group.total_amount}
                </p>
              </div>
              <hr className="mb-6" />
            </div>
          ))}
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Material"
      >
        <Form onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default Sales;
