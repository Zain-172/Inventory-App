import React from "react";

export default function MetricsCard({ title, value, icon, bgColor = "bg-green-500" }) {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow-md dark:shadow-${bgColor} ${bgColor} transition-colors`}>
      <div
        className={`p-3 rounded-full text-white ${bgColor} flex items-center shadow-sm shadow-black/50 justify-center mr-4 border border-white`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
