import { useState } from "react";
import {
  FaPencilAlt,
  FaSave,
  FaTimes,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";

const SelectMenu = ({ onModify, onDelete, isOpen, onSave, onDiscard }) => {
  const [modify, setModify] = useState(false);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`grid w-full fixed left-0 bottom-0 right-0 bg-white dark:bg-black border-t border-gray-300 dark:border-white shadow-lg z-30 ${
        isOpen ? "translate-y-0 opacity-100" : "translate-y-36 opacity-0"
      } transition-all duration-300`}
    >
      <button className="absolute top-1 right-1" onClick={() => { setModify(false); onSave(); }}>
        <FaTimesCircle />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`grid grid-cols-2 w-full`}
      >
        {modify ? (
          <>
            <div
              className="flex flex-col justify-center items-center border-r border-white/40 px-4 py-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-yellow-600 font-bold"
              onClick={() => {
                setModify(false);
                onSave();
              }}
            >
              <FaSave />
              Save
            </div>
            <div
              className="flex flex-col justify-center items-center px-4 py-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-[rgb(255,20,20)] font-bold"
              onClick={() => {
                setModify(false);
                onDiscard();
              }}
            >
              <FaTimes />
              Discard
            </div>
          </>
        ) : (
          <>
            <div
              className="flex flex-col justify-center items-center border-r border-white/40 px-4 py-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-yellow-600 font-bold"
              onClick={() => {
                setModify(true);
                onModify();
              }}
            >
              <FaPencilAlt />
              Modify
            </div>
            <div
              className="flex flex-col justify-center items-center px-4 py-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-[rgb(255,20,20)] font-bold"
              onClick={onDelete}
            >
              <FaTrashAlt />
              Delete
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default SelectMenu;
