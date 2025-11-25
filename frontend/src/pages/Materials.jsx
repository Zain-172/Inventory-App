import { useState } from "react";
import Navigation from "../component/Navigation";
import Table from "../component/Table";
import TopBar from "../component/TopBar";
import { FaPlusCircle } from "react-icons/fa";
import Dropdown from "../component/DropDown";
import Modal from "../component/Modal";
import Form from "../component/Form";

const Material = () => {
  const headers = ["ID", "Name", "Stock", "Price"];
  const data = [
        { id: 1, name: "Material X", stock: 100, price: 200 },
        { id: 2, name: "Material Y", stock: 50,  price: 500 },
        { id: 3, name: "Material Z", stock: 0,   price: 800 },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="grid grid-cols-[70px_1fr] min-h-screen">
      <nav>
        <Navigation />
      </nav>
      <main className="flex flex-col">
        <TopBar screen="Raw Materials" />
        <div className="px-2 py-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">Raw Materials</h2>
                <button onClick={() => setIsModalOpen(true)} className="mb-4 px-4 py-2 bg-green-500/40 text-white rounded font-bold flex items-center gap-2"><FaPlusCircle /> Material</button>
            </div>
          <Table headers={headers} data={data} accent="bg-green-500/40" />
          <Dropdown options={["Option 1", "Option 2", "Option 3"]} />
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Material">
        <Form onSubmit={(data) => console.log(data)} />
      </Modal>
    </div>
  );
};

export default Material;
