import Table from "../component/Table"
import Form from "../component/Form";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import { FaBroom } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CostCalculator() {

  const data = [
    { ID: 1, Material: "Material A", Cost_Price: 1000, Date: "2023-10-01" },
    { ID: 2, Material: "Material A", Cost_Price: 1000, Date: "2023-10-01" },
    { ID: 3, Material: "Material A", Cost_Price: 1000, Date: "2023-10-01" },
    { ID: 4, Material: "Material A", Cost_Price: 1000, Date: "2023-10-01" },
  ];

  return (
    <>
      <TopBar screen="Cost Calculator" />
      <main className="my-16 p-6 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-bold mb-4">Production Cost</h2>
          <Link to="/materials" className="mb-4 px-4 py-2 bg-green-500/40 text-white rounded font-bold flex items-center gap-2"><FaBroom /> Materials</Link>
        </div>
        <Table data={data} accent="bg-green-500/40" />
        <hr className="my-12" />
        <Form onSubmit={() => {}} />
      </main>
      <Navigation />
    </>
  );
}
