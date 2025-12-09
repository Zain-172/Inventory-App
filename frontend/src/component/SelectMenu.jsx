import { useState } from "react";
import {
  FaPencilAlt,
  FaSave,
  FaTimes,
  FaTrashAlt,
  FaHandPointer,
} from "react-icons/fa";
import Modal from "./Modal";

const SelectMenu = ({
  onModify,
  onDelete,
  open,
  setOpen,
  onSave,
  onDiscard,
  buttons,
}) => {
  const [modify, setModify] = useState(false);
  return (
    <>
      {modify ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center justify-evenly fixed bg-[#101010] p-4 rounded-lg shadow-md shadow-white/30 border border-white/40 gap-4 left-96 bottom-4 right-96 z-30 ${
            open ? "translate-y-0 opacity-100" : "translate-y-36 opacity-0"
          } transition-all duration-300`}
        >
          <div
            className="flex gap-2 justify-center items-center w-32 bg-[#222] px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-yellow-600 border border-yellow-600 font-bold"
            onClick={() => {
              setModify(false);
              onSave();
            }}
          >
            <FaSave />
            Save
          </div>
          <div
            className="flex gap-2 justify-center items-center w-32 bg-[#222] px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-[rgb(255,20,20)] border border-[rgb(255,20,20)] font-bold"
            onClick={() => {
              setModify(false);
              onDiscard();
            }}
          >
            <FaTimes />
            Discard
          </div>
        </div>
      ) : (
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <div className="bg-[#111] w-80 grid grid-rows-2 gap-4 p-4 rounded-lg shadow-lg shadow-white/10 border border-white/30">
            <h1 className="flex items-center justify-center gap-2 font-bold text-2xl">
              <FaHandPointer /> Action
            </h1>
            <p className="text-center text-sm mx-4">
              Please select the action you would like to perform.
            </p>
            <div className="flex justify-evenly items-center">
              { !buttons && <button
                className="flex gap-2 justify-center items-center w-32 bg-[#222] px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-yellow-600 font-bold"
                onClick={() => {
                  setModify(true);
                  onModify();
                }}
              >
                <FaPencilAlt />
                Modify
              </button> }
              <button
                className="flex gap-2 justify-center items-center w-32 bg-[#222] px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-[rgb(255,20,20)] font-bold"
                onClick={onDelete}
              >
                <FaTrashAlt />
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
export default SelectMenu;
