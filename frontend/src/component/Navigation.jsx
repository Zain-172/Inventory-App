import {
  FaBroom,
  FaThLarge,
  FaReceipt,
  FaUserCheck,
  FaUserAlt,
  FaCreditCard,
  FaHandshake,
  FaBook,
  FaCartPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {

  return (
    <nav
      className={`bg-white dark:bg-neutral-900 fixed left-0 bottom-0 right-0 flex overflow-hidden transition-all duration-300 z-1 rounded-t-lg shadow-[0_0px_1px] dark:shadow-white shadow-black`}
    >
      <ul className="grid grid-cols-9 items-center w-full">
        <li>
          <Link
            className="flex flex-col justify-center border-r gap-1 items-center my-2"
            to="/home"
          >
            <FaThLarge style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Dashboard</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-r gap-1 items-center my-2"
            to="/materials"
          >
            <FaBroom style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Materials</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-r gap-1 items-center my-2"
            to="/sales"
          >
            <FaReceipt style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Sales</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-r gap-1 items-center my-2"
            to="/order"
          >
            <FaCartPlus style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Order</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-r gap-1 items-center my-2"
            to="/expense"
          >
            <FaCreditCard style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Expense</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-r gap-1 items-center my-2"
            to="/employee"
          >
            <FaUserAlt style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Employees</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-r gap-1 items-center my-2"
            to="/customer"
          >
            <FaHandshake style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Customer</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center border-r gap-1 items-center my-2"
            to="/khata"
          >
            <FaBook style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Khata</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex flex-col justify-center gap-1 items-center my-2"
            to="/attendence"
          >
            <FaUserCheck style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Attendence</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
