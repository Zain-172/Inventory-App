import { useState } from "react";
import Navigation from "../component/Navigation";
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import { FaPlusCircle } from "react-icons/fa";
import Dropdown from "../component/DropDown";
import Modal from "../component/Modal";
import Form from "../component/SalesForm";

const Material = () => {
  const [open, setOpen] = useState(false);
  const data = [
      {
        invoice: "INV20251126001",
        salesman: "John Doe",
        date: "2025-11-26",
        data: [{ id: 1, name: "Material X", Quantity: 100, price: 200 }, { id: 2, name: "Material Y", Quantity: 50,  price: 500 }, { id: 3, name: "Material Z", Quantity: 25,   price: 800 }],
        totalItems: 175,
        totalPrice: 65000
      },
      {
        invoice: "INV20251126002",
        salesman: "Jane Smith",
        date: "2025-11-26",
        data: [{ id: 4, name: "Material A", Quantity: 75,  price: 300 }, { id: 5, name: "Material B", Quantity: 20,  price: 600 }, { id: 6, name: "Material C", Quantity: 10,   price: 900 }],
        totalItems: 105,
        totalPrice: 40500
      },
    ];
  const [isModalOpen, setIsModalOpen] = useState(false);
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
                <button onClick={() => setIsModalOpen(true)} className="mb-4 px-4 py-2 bg-blue-500/40 text-white rounded font-bold flex items-center gap-2"><FaPlusCircle /> Sale Items</button>
            </div>
          <hr className="mb-4" />
          {
            data.map((group, index) => (
              <div key={index}>  
                <div className="grid grid-cols-2 mb-2">
                  <p className="text-lg col-span-2"><strong>Invoice:</strong> {group.invoice}</p> 
                  <p className="text-lg"><strong>Salesman:</strong> {group.salesman}</p>
                  <p className="text-lg text-right"><strong>Date:</strong> {group.date}</p>
                </div>
                <Table open={open} setOpen={setOpen} data={group.data} accent="bg-blue-500/40" />
                <div className="flex justify-between items-center my-4">
                  <p className="text-lg font-bold">Total Items: {group.totalItems}</p>
                  <p className="text-lg font-bold">Total Price: {group.totalPrice}</p>
                </div>
                <hr className="mb-6" />
              </div>
            ))
          }
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Material">
        <Form onSubmit={(data) => console.log(data)} />
      </Modal>
    </div>
  );
};

export default Material;
