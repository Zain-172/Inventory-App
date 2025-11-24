"use client";
import { useState } from "react";
import {
  FaChartPie,
  FaStar,
  FaThLarge,
  FaUserCircle,
  FaWallet,
  FaDoorClosed,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`flex flex-col absolute top-0 left-0 px-[10px] h-full ${
        isOpen ? "w-[250px]" : "w-[70px]"
      } overflow-hidden transition-all duration-300 z-100 dark:bg-black border-r border-white bg-gray-200`}
    >
      <button
        onClick={toggleMenu}
        className="absolute flex flex-col items-center gap-1 top-2 right-3 left-3 py-3 rounded-full bg-white transition-all duration-300"
      >
        <div className={`w-[30px] bg-black h-1 rounded-2xl transition-all duration-300 ${ isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
        <div className={`w-[30px] bg-black h-1 rounded-2xl transition-all duration-300 ${ isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-[30px] bg-black h-1 rounded-2xl transition-all duration-300 ${ isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
      </button>
      <ul className="flex flex-col gap-2" style={{ margin: "6rem 0" }}>
        <li>
          <Link
            className="flex gap-4 border-b border-white/30 items-center"
            style={{ padding: "0.5rem 0" }}
            href="/admin/dashboard"
          >
            <FaThLarge style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Dashboard</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex gap-4 border-b border-white/30 items-center"
            style={{ padding: "0.5rem 0" }}
            href="/admin/package"
          >
            <FaPaperPlane style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Packages</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex gap-4 border-b border-white/30 items-center"
            style={{ padding: "0.5rem 0" }}
            href="/admin/stat"
          >
            <FaChartPie style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Statistics</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex gap-4 border-b border-white/30 items-center"
            style={{ padding: "0.5rem 0" }}
            href="/admin/payment"
          >
            <FaWallet style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Payments</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex gap-4 border-b border-white/30 items-center"
            style={{ padding: "0.5rem 0" }}
            href="/admin/client"
          >
            <FaUserCircle style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Clients</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex gap-4 border-b border-white/30 items-center"
            style={{ padding: "0.5rem 0" }}
            href="/admin/review"
          >
            <FaStar style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Reviews</p>
          </Link>
        </li>
        <li>
          <Link
            className="flex gap-4 border-b border-white/30 items-center"
            style={{ padding: "0.5rem 0" }}
            href="/"
          >
            <FaArrowLeft style={{ minWidth: "50px", fontSize: "1.5rem" }} />
            <p className="text-sm font-bold">Back</p>
          </Link>
        </li>
      </ul>
      <button className="flex gap-4 absolute bottom-2 right-2 left-2 border-t border-b border-white/30 hover:bg-[#333] transition-all duration-300 items-center py-2">
        <FaDoorClosed style={{ fontSize: "1.5rem", minWidth: "50px" }} />
        <p className="text-sm font-bold text-nowrap">Sign Out</p>
      </button>
    </nav>
  );
};

export default Navigation;
