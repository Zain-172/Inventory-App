
import Form from "../component/Form";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import { FaBroom } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { useAlertBox } from "../component/Alerts";
import { FaCheckCircle } from "react-icons/fa";

export default function CostCalculator() {
  const {
    loading,
    fetchCostCalculation,
    fetchProducts,
    fetchInventory,
  } = useAppData();
  const { alertBox } = useAlertBox();


  const handleSubmit = async (payload) => {
    try {
      const response = await fetch("http://localhost:5000/raw-material/add-raw-material", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error("Failed to save cost calculation", err);
        return false;
      }

      await Promise.all([fetchCostCalculation(), fetchProducts(), fetchInventory()]);
      alertBox("Cost calculation saved successfully", "Success", <FaCheckCircle />);
      return true;
    } catch (err) {
      console.error("Failed to save cost calculation:", err);
      return false;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <main className="p-6 flex flex-col gap-2">
        <TopBar>
          <div className="flex items-center gap-4 py-2 text-2xl font-bold">
            <FaBroom />
            Cost Calculator
          </div>
        </TopBar>
        <div className="flex justify-between items-center w-full mt-16">
          <h2 className="text-2xl font-bold mb-4">Production Cost</h2>
          <Link to="/materials" className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2"><FaBroom /> Materials</Link>
        </div>
        <Form onSubmit={handleSubmit} />
      </main>
      <Navigation />
    </>
  );
}
