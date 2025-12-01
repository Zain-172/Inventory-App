import { useState, useEffect } from "react";
import Navigation from "../component/Navigation";
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import { FaPlusCircle } from "react-icons/fa";
import Dropdown from "../component/DropDown";
import Modal from "../component/Modal";
import Form from "../component/SalesForm";

const Material = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/sale/with-items");
        const result = await response.json();
        if (isMounted) {
          setData(result);
          console.log("Fetched Sales Data:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSubmit = (data) => {
    const res = fetch("http://localhost:5000/sale/add-sale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Submitted Data:", data);
    console.log("Response:", res);
  };
  
  if (data.length <= 0) return null;
  return (
    <div className="grid" onClick={() => setOpen(false)}>
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
          {data.map((group, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 mb-2">
                <p className="text-lg col-span-2">
                  <strong>Invoice:</strong> {group.invoice_id}
                </p>
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

export default Material;
