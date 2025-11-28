import { useState } from "react";
import MessageBox from "./MessageBox";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import SelectMenu from "../component/SelectMenu";

export default function Table({ data, headers, accent = "bg-blue-500/40", open, setOpen }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [enable, setEnable] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/product/${deleteId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);
    } catch (err) {
      console.error(err);
    }
    setOpen(false)
  }
  if (data.length <= 0) return
  return (
    <div className="flex flex-col w-full" onClick={() => setOpen(false)}>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="">
            <tr>
              {Object.keys(data[0]).map((key, index) => (
                <th key={index} className="px-4 py-2 border text-left">
                  {key === "Action" ? "" : key.toUpperCase().replaceAll("_", " ")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y" onClick={(e) => e.stopPropagation()}>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border" onDoubleClick={() => {setOpen(true); setDeleteId(row.id)}}>
                {Object.keys(row).map((col, colIndex) => (
                  <td key={colIndex} className={`border p-0 ${accent} ${headers[colIndex] == "Action" || colIndex == 0 ? "w-6" : ""}`}>
                    { colIndex ? enable ? <input className="bg-transparent w-full rounded-none h-100 border-none focus:ring-0" type="text" defaultValue={row[col]} /> : <p className="p-2">{row[col]}</p>  : <p className="text-center w-8">{row[col]}</p>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <SelectMenu isOpen={open} onSave={() => {setEnable(false); setOpen(false)}} onDiscard={() => {setEnable(false); setOpen(false)}} onModify={() => setEnable(true)} onDelete={() => { setModalOpen(true); setOpen(false); }} />
        <MessageBox isOpen={modalOpen} onClose={() => setModalOpen(false)} message="Delete" onConfirm={handleDelete}>
          <div className="w-[300px] mb-2">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2 w-full mb-4"><FaTrashAlt />DELETE</h2>
            <p className="text-center text-sm" >
              Do you want to delete this <strong>Product X</strong> from your sales records?. <br /> <strong> Warning: </strong> This cannot be undone.
            </p>
          </div>
        </MessageBox>
      </div>
    </div>
  );
}
