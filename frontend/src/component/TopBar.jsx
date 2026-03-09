import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function TopBar({ children }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-2 rounded-b-lg shadow-[0_0px_1px] dark:shadow-white shadow-black z-10 gap-4 bg-white dark:bg-neutral-900">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 border-r-2 border-black dark:border-white transition-colors">
          <FaArrowCircleLeft />
        </button>
        {children}
      </div>
      <ThemeToggle />
    </header>
  );
}
