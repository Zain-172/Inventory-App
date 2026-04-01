import { useState, useRef, useEffect } from "react";
import { lazy } from "react";
const Navigation = lazy(() => import("../component/Navigation"));
const Table = lazy(() => import("../component/Table"));
const TopBar = lazy(() => import("../component/TopBar"));
const Modal = lazy(() => import("../component/Modal"));
const Form = lazy(() => import("../component/SalesForm"));
const Receipt = lazy(() => import("../component/Receipt"));
const Invoice = lazy(() => import("../component/Invoice"));
const DropDown = lazy(() => import("../component/DropDown"));
const Metrics = lazy(() => import("../component/Metrics"));
import {
  FaArrowsAltH,
  FaCheckCircle,
  FaEllipsisV,
  FaPlusCircle,
  FaPrint,
  FaReceipt,
  FaTrashAlt,
  FaUsers,
} from "react-icons/fa";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "../component/Alerts";
import MessageBox from "../component/MessageBox";
import {
  getSalesByDate,
  getSalesByMonth,
  getSalesByYear,
  updateSaleDeliveryStatus,
  updateSaleStatus,
  updateSaleTax,
} from "../api/Sale";

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

const Sales = () => {
  const { alertBox } = useAlertBox();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const {
    salesWithItems,
    setSalesWithItems,
    customers,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    period,
    month,
    years,
  } = useAppData();
  const [selectedSale, setSelectedSale] = useState(null);
  const [filter, setFilter] = useState("paid");
  const [custFilter, setCustFilter] = useState("all");
  const receiptRef = useRef(null);
  const [sale, setSale] = useState(0);
  const [updatingSaleId, setUpdatingSaleId] = useState(null);
  const [updatingDeliverySaleId, setUpdatingDeliverySaleId] = useState(null);
  const [updatingTaxSaleId, setUpdatingTaxSaleId] = useState(null);
  const [taxDrafts, setTaxDrafts] = useState({});

    useEffect(() => {
      const fetchData = async () => {
        let totalSale = 0;
        if (selectedPeriod.value === "daily") {
          totalSale = await getSalesByDate(selectedDate);
        } else if (selectedPeriod.value === "monthly") {
          totalSale = await getSalesByMonth(new Date().getFullYear() + "-" + selectedMonth.value);
        } else if (selectedPeriod.value === "annually") {
          totalSale = await getSalesByYear(selectedYear.value);
        }
        console.log(`Fetched total sale for ${selectedPeriod.value}:`, totalSale);
        setSale(totalSale);
      };
      if ((selectedPeriod.value === "daily" && selectedDate) ||
          (selectedPeriod.value === "monthly" && selectedMonth) ||
          (selectedPeriod.value === "annually" && selectedYear)) {
        fetchData();
      }
    }, [selectedPeriod, selectedDate, selectedMonth, selectedYear]);

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

  const handleTaxInputChange = (saleId, value) => {
    if (value === "") {
      setTaxDrafts((prev) => ({ ...prev, [saleId]: value }));
      return;
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue < 0) return;

    setTaxDrafts((prev) => ({ ...prev, [saleId]: value }));
  };

  const clearTaxDraft = (saleId) => {
    setTaxDrafts((prev) => {
      if (!(saleId in prev)) return prev;
      const next = { ...prev };
      delete next[saleId];
      return next;
    });
  };

  const handleTaxUpdate = async (saleId, currentTax) => {
    const rawValue = taxDrafts[saleId];
    if (rawValue === undefined) return;

    if (rawValue === "") {
      clearTaxDraft(saleId);
      alertBox("Tax cannot be empty", "Error", <FaCheckCircle />);
      return;
    }

    const parsedTax = Number(rawValue);
    if (!Number.isFinite(parsedTax) || parsedTax < 0) {
      clearTaxDraft(saleId);
      alertBox("Please enter a valid tax value", "Error", <FaCheckCircle />);
      return;
    }

    const normalizedTax = Number(parsedTax.toFixed(2));
    const previousTax = Number(currentTax || 0);

    if (normalizedTax === previousTax) {
      clearTaxDraft(saleId);
      return;
    }

    setUpdatingTaxSaleId(saleId);
    setSalesWithItems((prevData) =>
      prevData.map((entry) =>
        entry.id === saleId ? { ...entry, tax: normalizedTax } : entry,
      ),
    );

    try {
      await updateSaleTax(saleId, normalizedTax);
      clearTaxDraft(saleId);
    } catch (error) {
      console.error("Failed to update tax:", error);
      setSalesWithItems((prevData) =>
        prevData.map((entry) =>
          entry.id === saleId ? { ...entry, tax: previousTax } : entry,
        ),
      );
      clearTaxDraft(saleId);
      alertBox(error.message || "Failed to update tax", "Error", <FaCheckCircle />);
    } finally {
      setUpdatingTaxSaleId(null);
    }
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
      setIsModalOpen(false);
      window.location.reload();
    } else {
      console.error("Failed to add sale");
    }
  };
  const colors = {
    paid: "bg-green-600",
    half_payment: "bg-yellow-500",
    pending: "bg-red-500",
  };

  const options = customers
    .map((cust) => ({
      key: cust.customer,
      value: cust.id,
    }))
    .concat([{ key: "All", value: "all" }]);
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
        <div className="">
          <Metrics
            title="Total Sales"
            value={sale}
            icon={<FaReceipt />}
            bgColor="bg-gradient-to-l from-green-400 to-green-600"
          />
        </div>
        <div className="flex items-center justify-center gap-4 py-6">
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "paid" ? "bg-green-600 text-white" : "text-green-500"}`}
            onClick={() => setFilter("paid")}
          >
            Full Payment
          </button>
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "pending" ? "bg-green-600 text-white" : "text-green-500"}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "half_payment" ? "bg-green-600 text-white" : "text-green-500"}`}
            onClick={() => setFilter("half_payment")}
          >
            Half Payment
          </button>
          <button
            className={`py-2 px-4 border-green-500 border rounded-lg ${filter === "all" ? "bg-green-600 text-white" : "text-green-500"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>
        <div className="px-2 py-6">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4">Sales</h2>
              <div className="flex items-center justeify-center gap-4 mb-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <FaPlusCircle /> Sales
                </button>
                <DropDown
                  options={options}
                  onChange={(data) => setCustFilter(data.value)}
                  className="w-40 px-4 py-2 border border-[#555] rounded-lg flex justify-between items-center cursor-pointer"
                />
              </div>
            </div>
          </div>
          <hr className="mb-4" />
          {salesWithItems
            .filter((group) => {
              const statusMatch = group.status === filter || filter === "all";
              const custMatch = group.customer_id === custFilter || custFilter === "all";
              const typeMatch = group.type === "sale";
              return statusMatch && custMatch && typeMatch;
            })
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
                      <div className="absolute right-0 mt-10 w-40 dark:bg-neutral-900 bg-white rounded-lg shadow-xl shadow-black/40 border-white border flex flex-col">
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
                  <div className="text-lg text-right">
                    <strong>Tax:</strong>{" "}
                    <input
                      type="number"
                      className="w-20 border rounded px-1 py-0"
                      step="0.01"
                      min="0"
                      value={taxDrafts[group.id] ?? Number(group.tax || 0).toFixed(2)}
                      onChange={(e) => handleTaxInputChange(group.id, e.target.value)}
                      onBlur={() => handleTaxUpdate(group.id, group.tax)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                        if (e.key === "Escape") {
                          clearTaxDraft(group.id);
                          e.currentTarget.blur();
                        }
                      }}
                      disabled={updatingTaxSaleId === group.id}
                    />{" "}
                    %
                  </div>

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
                    Total Price (Incl Tax): {Number(group.total_amount) + (Number(group.tax) / 100) * Number(group.total_amount)}
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
        <Form onSubmit={handleSubmit} type="sale" />
      </Modal>
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
        <Invoice saleData={selectedSale} />
      </Modal>
    </div>
  );
};

export default Sales;
