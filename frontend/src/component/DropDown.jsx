import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaChevronCircleDown } from "react-icons/fa";

export default function Dropdown({
  label = "Select",
  options = [],
  onChange,
  className = "w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex justify-between items-center cursor-pointer",
  optionClassName = "px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onChange && onChange(option);
  };

  return (
    <div className="relative inline-block w-full">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className={className}
      >
        {selected}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <FaChevronCircleDown />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-2 w-full border rounded-xl shadow-lg z-20 px-1 py-2 bg-[#181818] border-white/20"
          >
            {options.map((option, index) => (
              <div
                key={index}
                className={optionClassName}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
