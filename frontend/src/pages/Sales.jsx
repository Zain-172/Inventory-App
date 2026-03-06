import { useState, useRef } from "react";
import Navigation from "../component/Navigation";
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import {
  FaArrowsAltH,
  FaCheckCircle,
  FaEllipsisV,
  FaPlusCircle,
  FaPrint,
  FaReceipt,
  FaTrashAlt,
} from "react-icons/fa";
import Modal from "../component/Modal";
import Form from "../component/SalesForm";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "../component/Alerts";
import MessageBox from "../component/MessageBox";
import Receipt from "../component/Receipt";

const Sales = () => {
  const { alertBox } = useAlertBox();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const {
    salesWithItems,
    setSalesWithItems,
    loading,
    from,
    setFrom,
    to,
    setTo,
    fetchSalesWithItems,
  } = useAppData();
  const [selectedSale, setSelectedSale] = useState(null);
  const [filter, setFilter] = useState("paid");
  const receiptRef = useRef(null);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/sale/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSalesWithItems((prevData) =>
          prevData.filter((sale) => sale.id !== id),
        );
        alertBox(
          "The Sale is deleted successfully",
          "Success",
          <FaCheckCircle />,
        );
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
      alertBox("The Sale is added successfully", "Success", <FaCheckCircle />);
      fetchSalesWithItems(from, to);
      setIsModalOpen(false);
    } else {
      console.error("Failed to add sale");
    }
  };
  const colors = {
    paid: "bg-green-500",
    half_payment: "bg-yellow-500",
    pending: "bg-red-500",
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  return (
    <div className="grid" onClick={() => setOpenMenuIndex(null)}>
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <h1 className="text-2xl font-bold flex items-center py-2 gap-2">
          <FaReceipt />
          Sales
        </h1>
      </TopBar>
      <main className="flex flex-col my-16 w-full">
        <div className="flex items-center justify-center gap-4 py-6">
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "paid" ? "bg-green-500 text-white" : "bg-white text-green-500"}`}
            onClick={() => setFilter("paid")}
          >
            Full Payment
          </button>
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "pending" ? "bg-green-500 text-white" : "bg-white text-green-500"}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "half_payment" ? "bg-green-500 text-white" : "bg-white text-green-500"}`}
            onClick={() => setFilter("half_payment")}
          >
            Half Payment
          </button>
        </div>
        <div className="px-2 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4">Sales</h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex flex-row justify-end items-center gap-2 py-2">
                <div className="flex flex-col items-center">
                  <p className="gap-2 font-semibold">From</p>
                </div>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border px-2 py-1 rounded-md"
                />
                <FaArrowsAltH />
                <div className="flex flex-col items-center">
                  <p className="gap-2 font-semibold">To</p>
                </div>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border px-2 py-1 rounded-lg "
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold flex items-center gap-2"
              >
                <FaPlusCircle /> Sale Items
              </button>
            </div>
          </div>
          <hr className="mb-4 border-neutral-800" />
          {salesWithItems
            .filter((group) => group.status === filter || filter === "all")
            .map((group, index) => (
              <div key={index} className="">
                <div className="grid grid-cols-2 mb-2">
                  <p className="text-lg">
                    <strong>Invoice:</strong> {group.invoice_id}
                  </p>
                  <div className="flex justify-end">
                    <button
                      className={`p-2 rounded-lg ${colors[group.status]} hover:bg-gray-700 text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuIndex(
                          openMenuIndex === index ? null : index,
                        );
                      }}
                    >
                      <FaEllipsisV />
                    </button>
                    {openMenuIndex === index && (
                      <div className="absolute right-0 mt-10 w-40 bg-[#111] border border-white/40 text-white rounded-lg shadow-lg flex flex-col">
                        <button
                          className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 font-bold rounded-t-lg border-b border-white/40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMessageBoxOpen(true);
                          }}
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                        <button
                          className="flex items-center gap-2 hover:bg-gray-700 px-4 py-2 font-bold rounded-b-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSale(group);
                            setIsPrintModalOpen(true);
                          }}
                        >
                          <FaPrint />
                          Print
                        </button>
                        {isMessageBoxOpen && openMenuIndex === index && (
                          <MessageBox
                            isOpen={isMessageBoxOpen}
                            onClose={() => setIsMessageBoxOpen(false)}
                            message="Delete"
                            onConfirm={() => handleDelete(group.id)}
                          >
                            <div className="w-[300px] mb-2">
                              <h2 className="text-xl font-bold flex items-center justify-center gap-2 w-full mb-4">
                                <FaTrashAlt />
                                DELETE
                              </h2>
                              <p className="text-center text-sm">
                                Do you want to delete this{" "}
                                <strong>Sale Record</strong> from your sales
                                records?. <br /> <strong> Warning: </strong> If
                                you delete this the quantity is added to stock.
                              </p>
                            </div>
                          </MessageBox>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-lg">
                    <strong>Salesman:</strong> {group.salesman}
                  </p>
                  <p className="text-lg text-right">
                    <strong>Date:</strong> {group.sale_date}
                  </p>
                  <p className="text-lg">
                    <strong>Shop:</strong> {group.shop}
                  </p>
                  <p className="text-lg text-right">
                    <strong>Status:</strong>{" "}
                    {group.status.toUpperCase().replace("_", " ")}
                  </p>
                </div>
                <Table data={group.items} accent={colors[group.status]} />
                <div className="flex justify-between items-center my-4">
                  <p className="text-lg font-bold">
                    Total Items: {group.total_items}
                  </p>
                  <p className="text-lg font-bold">
                    Total Price: {group.total_amount}
                  </p>
                </div>
                <hr className="mb-6 bg-neutral-800" />
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
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Print Receipt"
      >
        <Receipt saleData={selectedSale} ref={receiptRef} />
      </Modal>
    </div>
  );
};

export default Sales;
