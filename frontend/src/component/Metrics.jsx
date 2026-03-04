import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function MetricsCard({ title, value, icon, bgColor = "bg-green-500", enableToggle = true, showValue = false }) {
  const [isShown, setIsShown] = useState(showValue); // If toggle is disabled, show value by default

  return (
    <div className={`flex items-center p-4 rounded-lg shadow-[0_2px_10px] shadow-black/40 ${bgColor} transition-colors min-h-32 mb-4`}>
      <div
        className={`p-3 rounded-full text-white ${bgColor} flex items-center shadow-sm shadow-black/50 justify-center mr-4 border border-white`}
      >
        {icon}
      </div>
      <div className="w-full">
        <p className="text-2xl font-bold text-white">{title}</p>
        <div className="flex items-center justify-between w-full mt-4 ">
          <p className="text-xl font-bold text-white">{isShown ? value : "••••"}</p>
          {enableToggle && (
            <button className="text-white hover:text-gray-200" onClick={() => setIsShown(!isShown)}>
              {isShown ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
