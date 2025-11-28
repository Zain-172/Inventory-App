import {
  FaBroom,
  FaThLarge,
  FaReceipt,
  FaPagelines,
  FaPage4,
  FaBook,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {

  return (
    <nav
      className={`fixed left-0 bottom-0 right-0 flex overflow-hidden transition-all duration-300 z-100 dark:bg-black border-t border-white bg-gray-200`}
    >
      <ul className="grid grid-cols-4 items-center w-full">
        <li>
          <Link
            className="flex flex-col justify-center border-white/50 border-r gap-1 items-center my-2"
            to="/"
          >
            <FaThLarge style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Dashboard</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-white/50 border-r gap-1 items-center my-2"
            to="/materials"
          >
            <FaBroom style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Materials</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-white/50 border-r gap-1 items-center my-2"
            to="/sales"
          >
            <FaReceipt style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Sales</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center gap-1 items-center my-2"
            to="/report"
          >
            <FaBook style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Reports</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
