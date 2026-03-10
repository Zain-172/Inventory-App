import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MetricsCard({ title, value, icon, bgColor = "bg-green-600", enableToggle = true, showValue = false, to = "#" }) {
  const [isShown, setIsShown] = useState(showValue); // If toggle is disabled, show value by default

  return (
    <Link to={to} className={`flex flex-col justify-center p-4 rounded-xl shadow-[0_2px_10px] shadow-black/40 ${bgColor} transition-colors min-h-40 mb-4`}>
      <div className="flex items-center">
        <div
          className={`p-3 rounded-full text-white ${bgColor} flex items-center shadow-sm shadow-black/50 justify-center mr-4 border border-white`}
        >
          {icon}
        </div>
        <p className="text-2xl font-bold text-white">{title}</p>
      </div>
      <div className="ml-20">
        <div className="flex items-center justify-between w-full ">
          <p className="text-xl font-bold text-white">{isShown ? value : "••••"}</p>
          {enableToggle && (
            <button className="text-white hover:text-gray-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsShown(!isShown); }}>
              {isShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
