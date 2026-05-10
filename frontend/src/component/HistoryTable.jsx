import { useState } from "react";
import MessageBox from "./MessageBox";
import { deleteProductHistory } from "../api/ProductHistory";
import { FaPencilAlt, FaTrashAlt, FaHandPointer } from "react-icons/fa";
import Modal from "./Modal";

export default function HistoryTable({
  data,
  accent = "bg-green-600",
  open,
  setOpen,
  load
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    deleteProductHistory(id)
      .then(() => load())
      .catch((err) => console.error(err));
  };

  if (data.length <= 0) return null;
  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full border rounded-lg overflow-hidden  ">
          <thead className="text-sm font-medium uppercase">
            <tr>
              {Object.keys(data[0]).map((key, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 border text-left ${key.toLowerCase() === "id" ? "text-center" : ""}`}
                >
                  {key === "Action" ? "" : key.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y" onClick={(e) => e.stopPropagation()}>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border"
                onClick={() => {
                  setOpen(true);
                  setDeleteId(row.id);
                }}
              >
                {Object.keys(row).map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border p-0 ${accent} ${data[0][colIndex] === "Action" ? "w-2" : ""}`}
                  >
                    {col !== "id" ? (
                      <p className="p-2 min-w-[150px]">{row[col]}</p>
                    ) : (
                      <p className="text-center">{rowIndex + 1}</p>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 w-80 grid grid-rows-2 gap-4 p-4 rounded-2xl shadow-lg shadow-white/10 border border-white/30">
            <h1 className="flex items-center justify-center gap-2 font-bold text-2xl">
              <FaHandPointer /> Action
            </h1>
            <p className="text-center text-sm mx-4">
              Please select the action you would like to perform.
            </p>
            <div className="flex justify-evenly items-center">
              <button
                className="flex gap-2 justify-center items-center w-32 bg-red-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600 transition-colors text-white font-bold"
                onClick={() => { setModalOpen(true); setOpen(false); }}
              >
                <FaTrashAlt />
                Delete
              </button>
            </div>
          </div>
        </Modal>
        <MessageBox
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          message="Delete"
          onConfirm={() => {
            handleDelete(deleteId);
            setModalOpen(false);
          }}
        >
          <div className="w-[300px] mb-2">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2 w-full mb-4">
              <FaTrashAlt />
              DELETE
            </h2>
            <p className="text-center text-sm">
              Do you want to delete this <strong>Product</strong> from your
              sales records?. <br /> <strong> Warning: </strong> This cannot be
              undone.
            </p>
          </div>
        </MessageBox>
      </div>
    </div>
  );
}
