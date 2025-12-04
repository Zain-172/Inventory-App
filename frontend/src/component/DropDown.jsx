import { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaChevronCircleDown } from "react-icons/fa";

export default function Dropdown({
  label = { value: 0, key: "Select" },
  options = [],
  onChange,
  className = "w-full px-4 py-2 bg-[#181818] border border-gray-600 rounded-lg flex justify-between items-center cursor-pointer",
  optionClassName = "flex items-center gap-4 px-4 py-2 cursor-pointer border-t border-white/30 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
  value,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || label);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onChange && onChange(option);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={className}
        type="button"
      >
        {selected.key}
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
            className="absolute mt-2 w-full border rounded-xl shadow-lg z-20 px-1 py-2 bg-[#181818] border-white/20 max-h-44 overflow-auto"
          >
            <div className="px-4 py-1 border-b">{label.key}</div>

            {options.map((option, index) => (
              <div
                key={index}
                className={optionClassName}
                onClick={() => handleSelect(option)}
              >
                <div className={`border p-1 rounded-full ${selected.key === option.key ? "bg-white" : ""}`}></div>{option.key}
              </div>
            ))}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
