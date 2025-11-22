"use client"
import { useState } from "react";
import { FaChartPie, FaPaperPlaneDeparture, FaStar, FaThLarge, FaUserCircle, FaWallet, FaDoorClosed, FaDoorOpen, FaPaperPlane, FaBackward, FaBackspace, FaStepBackward, FaArrowLeft } from "react-icons/fa";


const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`text-white flex flex-col absolute top-0 left-0 px-[10px] h-full ${ isOpen ? "w-[250px]" : "w-[70px]"} overflow-hidden transition-all duration-300`} style={{ zIndex: 1000, backgroundColor: "#101010", borderRight: "1px solid rgba(255, 255, 255, 0.3)" }}>
      <button onClick={toggleMenu} className="absolute flex flex-col items-center gap-1 top-2 right-0 w-[70px]">
        <div className="w-[30px] bg-white h-1 rounded-2xl"></div>
        <div className="w-[30px] bg-white h-1 rounded-2xl"></div>
        <div className="w-[30px] bg-white h-1 rounded-2xl"></div>
      </button>
        <ul className="flex flex-col gap-4" style={{margin: "6rem 0"}}>
          <li><Link className="flex gap-4 border-b border-white/30 items-center" style={{ padding: "0.5rem 0"}} href="/admin/dashboard"><FaThLarge style={{ minWidth: "50px", fontSize: "2rem"}} /><p className="text-sm font-bold">Dashboard</p></Link></li>
          <li><Link className="flex gap-4 border-b border-white/30 items-center" style={{ padding: "0.5rem 0"}} href="/admin/package"><FaPaperPlane style={{ minWidth: "50px", fontSize: "2rem"}} /><p className="text-sm font-bold">Packages</p></Link></li>
          <li><Link className="flex gap-4 border-b border-white/30 items-center" style={{ padding: "0.5rem 0"}} href="/admin/stat"><FaChartPie style={{ minWidth: "50px", fontSize: "2rem"}} /><p className="text-sm font-bold">Statistics</p></Link></li>
          <li><Link className="flex gap-4 border-b border-white/30 items-center" style={{ padding: "0.5rem 0"}} href="/admin/payment"><FaWallet style={{ minWidth: "50px", fontSize: "2rem"}} /><p className="text-sm font-bold">Payments</p></Link></li>
          <li><Link className="flex gap-4 border-b border-white/30 items-center" style={{ padding: "0.5rem 0"}} href="/admin/client"><FaUserCircle style={{ minWidth: "50px", fontSize: "2rem"}} /><p className="text-sm font-bold">Clients</p></Link></li>
          <li><Link className="flex gap-4 border-b border-white/30 items-center" style={{ padding: "0.5rem 0"}} href="/admin/review"><FaStar style={{ minWidth: "50px", fontSize: "2rem"}} /><p className="text-sm font-bold">Reviews</p></Link></li>
          <li><Link className="flex gap-4 border-b border-white/30 items-center" style={{ padding: "0.5rem 0"}} href="/"><FaArrowLeft style={{ minWidth: "50px", fontSize: "2rem"}} /><p className="text-sm font-bold">Back</p></Link></li>
        </ul>
        <button className="flex gap-4 absolute bottom-2">
          <FaDoorClosed style={{ fontSize: "2rem", minWidth: "50px" }} /><p className="text-sm whitespace-nowrap">Log Out</p>
        </button>
    </nav>
  );
};

export default Navigation;