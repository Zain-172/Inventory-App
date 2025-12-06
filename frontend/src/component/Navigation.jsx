import {
  FaBroom,
  FaThLarge,
  FaReceipt,
  FaPagelines,
  FaPage4,
  FaBook,
  FaMoneyBill,
  FaUserAlt,
  FaCreditCard,
  FaHandshake,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {

  return (
    <nav
      className={`fixed left-0 bottom-0 right-0 flex overflow-hidden transition-all duration-300 z-100 bg-black border-t border-white`}
    >
      <ul className="grid grid-cols-7 items-center w-full">
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
            className="flex flex-col justify-center border-white/50 border-r gap-1 items-center my-2"
            to="/expense"
          >
            <FaCreditCard style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Expense</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-white/50 border-r gap-1 items-center my-2"
            to="/report"
          >
            <FaBook style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Reports</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-white/50 border-r gap-1 items-center my-2"
            to="/employee"
          >
            <FaUserAlt style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Employees</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center gap-1 items-center my-2"
            to="/customer"
          >
            <FaHandshake style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Customer</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
