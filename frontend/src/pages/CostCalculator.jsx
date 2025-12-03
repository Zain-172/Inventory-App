import Table from "../component/Table"
import Form from "../component/Form";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import { FaBroom } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import RawMaterial from "../models/RawMaterial";

export default function CostCalculator() {
  const [open, setOpen] = useState(false);
  const { rawMaterials, setRawMaterials, loading } = useAppData();

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/raw-material/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRawMaterials((prevMaterials) => prevMaterials.filter((material) => material.id !== id));
      } else {
        console.error("Failed to delete raw material");
      }
    } catch (err) {
      console.error("Failed to delete raw material:", err);
    }
  };

    const handleModify = async (editedData, deleteId) => {
    const res = await fetch(`http://localhost:5000/raw-material/${deleteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(new RawMaterial(editedData))
    });
    if (res.ok) {
      console.log("Modified successfully");
    } else {
      console.error("Failed to modify");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <TopBar screen="Cost Calculator" />
      <main className="my-16 p-6 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-bold mb-4">Production Cost</h2>
          <Link to="/materials" className="mb-4 px-4 py-2 bg-green-500/40 text-white rounded font-bold flex items-center gap-2"><FaBroom /> Materials</Link>
        </div>
        <Table data={rawMaterials} nonEditable="cost_price" open={open} setOpen={setOpen} onDelete={handleDelete} onUpdate={handleModify} accent="bg-green-500/40" />
        <hr className="my-12" />
        <Form />
      </main>
      <Navigation />
    </>
  );
}
