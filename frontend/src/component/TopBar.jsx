import { FaArrowCircleLeft, FaPowerOff, FaUserAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import ThemeToggle from "./ThemeToggle";

export default function TopBar({ children }) {
  const navigate = useNavigate();
  const user = useMemo(() => {
    const storedUser = localStorage.getItem("inventory_user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);


  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-2 rounded-b-lg shadow-[0_0px_1px] dark:shadow-white shadow-black z-10 gap-4 bg-white dark:bg-neutral-900 no-print">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 border-r-2 border-black dark:border-white transition-colors">
          <FaArrowCircleLeft />
        </button>
        {children}
      </div>
      <div className="flex items-center justify-center gap-4 px-4">
        <Link
          to="/user-account"
          className="flex flex-col leading-tight text-right hover:text-green-600 transition-colors"
        >
          <span className="text-sm font-semibold max-w-44 truncate">{user?.username || "User Account"}</span>
          <span className="text-xs text-neutral-600 dark:text-neutral-300 max-w-44 truncate">{user?.email || "View profile"}</span>
        </Link>
        <Link to="/user-account" className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-full"><FaUserAlt /></Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
