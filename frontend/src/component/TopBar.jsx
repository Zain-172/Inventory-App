import { FaArrowCircleLeft, FaPowerOff } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAlertBox } from "./Alerts";

export default function TopBar({ children }) {
  const navigate = useNavigate();
  const { alertBox } = useAlertBox();

  const handleLogout = async () => {
    // Clear any authentication tokens or user data here
    const reponse = await alertBox("Are you want to Log out", "Success", <FaPowerOff />);
    console.log(reponse);
    if (reponse) {
      navigate("/");
    }
  }


  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-2 rounded-b-lg shadow-[0_0px_1px] dark:shadow-white shadow-black z-1 gap-4 bg-white dark:bg-neutral-900">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="px-4 py-2 border-r-2 border-black dark:border-white transition-colors">
          <FaArrowCircleLeft />
        </button>
        {children}
      </div>
      <div className="flex items-center justify-center gap-4 px-4">
        <ThemeToggle />
        <button className="bg-neutral-200 dark:bg-neutral-700 p-2 rounded-full" onClick={handleLogout}><FaPowerOff /></button>
      </div>
    </header>
  );
}
