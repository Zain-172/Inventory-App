import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TopBar({ children }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-start items-center p-2 border-b rounded-b-lg shadow-md z-10 gap-4 bg-white">
      <button onClick={() => navigate(-1)} className="px-4 py-2 border-r-2 border-black text-black hover:text-gray-900 transition-colors">
        <FaArrowCircleLeft />
      </button>
      {children}
    </header>
  );
}
