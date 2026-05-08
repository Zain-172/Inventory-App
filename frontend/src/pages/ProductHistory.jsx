import { useEffect, useState } from "react";
import Table from "../component/Table";
import { fetchProductHistory, deleteProductHistory } from "../api/ProductHistory";

export default function ProductHistory() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const load = () => {
    fetchProductHistory()
      .then((rows) => {
        // normalize headers to be consistent with Table usage
        const normalized = rows.map((r) => ({
          id: r.id,
          name: r.name,
          stock: r.stock,
          cost_price: r.cost_price,
          barcode: r.barcode,
          date: r.date,
          action: r.action,
          type: r.type,
        }));
        setData(normalized);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id) => {
    deleteProductHistory(id)
      .then(() => load())
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product History</h1>
      <div>
        {data && data.length > 0 ? (
          <Table
            data={data}
            open={open}
            setOpen={setOpen}
            onDelete={handleDelete}
            onUpdate={() => {}}
            nonEditable={"back"}
          />
        ) : (
          <p>No product history available.</p>
        )}
      </div>
    </div>
  );
}
