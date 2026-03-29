import { useState, useRef } from "react";
import { lazy } from "react";
const Navigation = lazy(() => import("../component/Navigation"));
const Table = lazy(() => import("../component/Table"));
const TopBar = lazy(() => import("../component/TopBar"));
const Modal = lazy(() => import("../component/Modal"));
const Form = lazy(() => import("../component/SalesForm"));
const Receipt = lazy(() => import("../component/Receipt"));
const Invoice = lazy(() => import("../component/Invoice"));
const DropDown = lazy(() => import("../component/DropDown"));
import {
  FaCheckCircle,
  FaEllipsisV,
  FaPlusCircle,
  FaPrint,
  FaReceipt,
  FaTrashAlt,
  FaUser,
} from "react-icons/fa";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "../component/Alerts";
import MessageBox from "../component/MessageBox";
import {
  updateSaleDeliveryStatus,
  updateSaleStatus,
} from "../api/Sale";
import { useParams } from "react-router-dom";

const statusStyles = {
  paid: "bg-green-800 text-white",
  half_payment: "bg-yellow-500 text-black",
  pending: "bg-red-600 text-white",
};

const nextStatus = {
  paid: "pending",
  pending: "half_payment",
  half_payment: "paid",
};

const deliveryStyles = {
  delivered: "bg-green-800 text-white",
  not_delivered: "bg-red-600 text-white",
};

const nextDeliveryStatus = {
  delivered: "not_delivered",
  not_delivered: "delivered",
};

const formatStatusLabel = (status) =>
  status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const CustomerSales = () => {
  const { id } = useParams();
  const { alertBox } = useAlertBox();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const {
    salesWithItems,
    setSalesWithItems,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    selectedDate,
    setSelectedDate,
    setSelectedMonth,
    setSelectedYear,
    period,
    month,
    years,
    customers
  } = useAppData();
  const [selectedSale, setSelectedSale] = useState(null);
  const receiptRef = useRef(null);
  const invoiceRef = useRef(null);
  const [updatingSaleId, setUpdatingSaleId] = useState(null);
  const [updatingDeliverySaleId, setUpdatingDeliverySaleId] = useState(null);


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

  const handleStatusToggle = async (saleId, currentStatus) => {
    const next = nextStatus[currentStatus] || "paid";

    setUpdatingSaleId(saleId);
    setSalesWithItems((prevData) =>
      prevData.map((entry) =>
        entry.id === saleId ? { ...entry, status: next } : entry,
      ),
    );

    try {
      await updateSaleStatus(saleId, next);
    } catch (error) {
      console.error("Failed to update sale status:", error);
      setSalesWithItems((prevData) =>
        prevData.map((entry) =>
          entry.id === saleId ? { ...entry, status: currentStatus } : entry,
        ),
      );
      alertBox(
        error.message || "Failed to update sale status",
        "Error",
        <FaCheckCircle />,
      );
    } finally {
      setUpdatingSaleId(null);
    }
  };

  const handleDeliveryStatusToggle = async (saleId, currentDeliveryStatus) => {
    const next = nextDeliveryStatus[currentDeliveryStatus] || "not_delivered";

    setUpdatingDeliverySaleId(saleId);
    setSalesWithItems((prevData) =>
      prevData.map((entry) =>
        entry.id === saleId ? { ...entry, delivery_status: next } : entry,
      ),
    );

    try {
      await updateSaleDeliveryStatus(saleId, next);
    } catch (error) {
      console.error("Failed to update delivery status:", error);
      setSalesWithItems((prevData) =>
        prevData.map((entry) =>
          entry.id === saleId ? { ...entry, delivery_status: currentDeliveryStatus } : entry,
        ),
      );
      alertBox(
        error.message || "Failed to update delivery status",
        "Error",
        <FaCheckCircle />,
      );
    } finally {
      setUpdatingDeliverySaleId(null);
    }
  };
  const colors = {
    paid: "bg-green-600",
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
          <FaUser />
          Customer
        </h1>
      </TopBar>
      <main className="flex flex-col my-16 w-full p-4">
        <div className="flex gap-6 w-full">
          <div className="flex flex-col font-bold gap-2 mb-4 w-full">
            <label htmlFor="report-frequency">Period:</label>
            <DropDown
              options={period}
              value={period[0]}
              onChange={(data) => setSelectedPeriod(data)}
            />
          </div>
          <div className="flex flex-col font-bold gap-2 mb-4 w-full">
            <label htmlFor="report-date">
              {selectedPeriod.value === "monthly" && "Month : "}
              {selectedPeriod.value === "daily" && "Date : "}
              {selectedPeriod.value === "annually" && "Year : "}
            </label>
            {selectedPeriod.value === "monthly" && (
              <DropDown
                options={month}
                value={month[0]}
                onChange={(data) => setSelectedMonth(data)}
              />
            )}
            {selectedPeriod.value === "daily" && (
              <input
                type="date"
                className="border p-2 rounded-lg w-full bg-white"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}
            {selectedPeriod.value === "annually" && (
              <DropDown
                options={years}
                value={years[years.length - 1]}
                onChange={(data) => setSelectedYear(data)}
              />
            )}
          </div>
        </div>
        <div className="px-2 py-6">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4">{customers.find((customer) => customer.id == id)?.customer || "Customer"}</h2>
            </div>
          </div>
          <hr className="mb-4 bg-neutral-900 dark:bg-neutral-200" />
          {salesWithItems
            .filter((group) => group.customer_id == id)
            .map((group, index) => (
              <div key={index} className="">
                <div className="grid grid-cols-2 mb-2">
                  <p className="text-lg">
                    <strong>Invoice:</strong> {group.invoice_id}
                  </p>
                  <div className="flex justify-end">
                    <button
                      className={`p-2 rounded-lg ${colors[group.status]} text-white`}
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
                      <div className="absolute right-0 mt-10 w-40 dark:bg-neutral-900 bg-white rounded-lg shadow-lg flex flex-col">
                        <button
                          className="flex items-center gap-2 px-4 py-2 font-bold rounded-t-lg border-b text-red-600 dark:border-white/40 border-black/40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMessageBoxOpen(true);
                          }}
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 font-bold border-b text-blue-600 dark:border-white/40 border-black/40"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSale(group);
                            setIsPrintModalOpen(true);
                          }}
                        >
                          <FaPrint />
                          Sale Receipt
                        </button>

                        <button
                          className="flex items-center gap-2 px-4 py-2 font-bold rounded-b-lg text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSale(group);
                            setIsInvoiceModalOpen(true);
                          }}
                        >
                          <FaReceipt />
                          Invoice
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
                    <strong>Customer:</strong> {group.customer}
                  </p>
                  <p className="text-lg text-right">
                    <strong>Tax:</strong> {Number(group.tax || 0).toFixed(2)} %
                  </p>

                  <div className="text-lg my-2">
                    <strong>Status:</strong>{" "}
                    <button
                      type="button"
                      className={`px-3 rounded-md font-semibold transition-colors border ${statusStyles[group.status]}`}
                      onClick={() => handleStatusToggle(group.id, group.status)}
                      disabled={updatingSaleId === group.id}
                    >
                      {formatStatusLabel(group.status)}
                    </button>
                  </div>
                  <div className="text-lg text-right my-2">
                    <strong>Delivery:</strong>{" "}
                    <button
                      type="button"
                      className={`px-3 rounded-md font-semibold transition-colors border ${deliveryStyles[group.delivery_status || "not_delivered"]}`}
                      onClick={() =>
                        handleDeliveryStatusToggle(
                          group.id,
                          group.delivery_status || "not_delivered",
                        )
                      }
                      disabled={updatingDeliverySaleId === group.id}
                    >
                      {formatStatusLabel(group.delivery_status || "not_delivered")}
                    </button>
                  </div>
                </div>
                <Table data={group.items} accent={colors[group.status]} />
                <div className="flex justify-between items-center my-4">
                  <p className="text-lg font-bold">
                    Total Items: {group.total_items}
                  </p>
                  <p className="text-lg font-bold">
                    Total Price (Incl Tax): {group.total_amount + group.tax/100 * group.total_amount}
                  </p>
                </div>
                <hr className="mb-6 bg-neutral-900 dark:bg-neutral-200" />
              </div>
            ))}
        </div>
      </main>
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Print Receipt"
      >
        <Receipt saleData={selectedSale} ref={receiptRef} />
      </Modal>
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Print Invoice"
      >
        <Invoice saleData={selectedSale} ref={invoiceRef} />
      </Modal>
    </div>
  );
};

export default CustomerSales;
