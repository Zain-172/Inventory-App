import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaUserCircle } from "react-icons/fa";

export default function TopBar({ screen }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-black border-b dark:border-white   ">
      <div className="text-xl font-bold text-gray-900 dark:text-white">
        {screen || "Dashboard"}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        <div className="relative">
          <button className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <FaUserCircle size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
