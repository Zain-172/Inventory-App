import { useState } from "react";
import MessageBox from "./MessageBox";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import SelectMenu from "../component/SelectMenu";

export default function Table({ data, accent = "bg-blue-500/40", open, setOpen, onDelete, onUpdate, nonEditable }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [enable, setEnable] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editedData, setEditedData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  if (data.length <= 0) return null;
  return (
    <div className="flex flex-col w-full">
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
              <tr key={rowIndex} className="border" onClick={() => {setOpen(true); setDeleteId(row.id); console.log("Selected row id:", row.id);}}>
                {Object.keys(row).map((col, colIndex) => (
                  <td key={colIndex} className={`border p-0 ${accent} ${colIndex == 0 ? "w-6" : ""}`}>
                    { colIndex ? enable && col !== nonEditable && deleteId === row.id ? <input className="bg-transparent w-full rounded-none h-100 border-none focus:ring-0" type="text" name={col} value={editedData[col] || row[col]} onChange={handleChange} /> : <p className="p-2 min-w-[150px]">{row[col]}</p>  : <p className="text-center w-8">{row[col]}</p>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <SelectMenu open={open} setOpen={setOpen} onSave={() => { onUpdate(editedData, deleteId); setOpen(false); setEnable(false); }} onDiscard={() => {setEnable(false); setOpen(false)}} onModify={() => { setEditedData(data.find(item => item.id === deleteId)); setEnable(true); }} onDelete={() => { setModalOpen(true); setOpen(false); }} />
        <MessageBox isOpen={modalOpen} onClose={() => setModalOpen(false)} message="Delete" onConfirm={() => {onDelete(deleteId); setModalOpen(false);}}>
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
