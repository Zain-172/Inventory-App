import { useState } from "react";
import { FaBook, FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import Table from "../component/Table";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import Modal from "../component/Modal";
import KhataForm from "../component/KhataForm";
import { useAppData } from "../context/useAppData";
import { useAlertBox } from "../component/useAlertBox";

const Khata = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { loading, khatas, setKhatas, fetchKhatas } = useAppData();
  const { alertBox } = useAlertBox();

  const handleSubmit = async (data) => {
    const res = await fetch("http://localhost:5000/khata/add-khata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newKhata = await res.json();
      setKhatas((prev) => [newKhata, ...prev]);
      alertBox("Khata account added successfully", "Success", <FaCheckCircle />);
    } else {
      console.error("Failed to add khata account");
    }
  };

  const handleModify = async (editedData, id) => {
    try {
      const res = await fetch(`http://localhost:5000/khata/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });

      if (res.ok) {
        await fetchKhatas();
        alertBox("Khata account updated successfully", "Success", <FaCheckCircle />);
      } else {
        console.error("Failed to update khata account");
      }
    } catch (error) {
      console.error("Failed to update khata account", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/khata/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setKhatas((prev) => prev.filter((item) => item.id !== id));
        alertBox("Khata account deleted successfully", "Success", <FaCheckCircle />);
      } else {
        console.error("Failed to delete khata account");
      }
    } catch (error) {
      console.error("Failed to delete khata account", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <div className="flex items-center gap-4 py-2 text-2xl font-bold">
          <FaBook />
          Khata
        </div>
      </TopBar>
      <main className="flex flex-col my-16 w-screen">
        <div className="px-2 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Khata Accounts</h2>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 font-bold bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            <FaPlusCircle /> Khata
          </button>
        </div>
        <div className="px-2 mb-8">
            {khatas.length === 0 ? (
              <div className="text-center text-gray-500 italic">No khata accounts found. Click "Add Khata" to create one.</div>
            ) : 
          <Table
            data={khatas}
            onDelete={handleDelete}
            onUpdate={handleModify}
            open={open}
            setOpen={setOpen}
            accent="bg-green-600"
          />
        }
        </div>
      </main>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <KhataForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default Khata;
