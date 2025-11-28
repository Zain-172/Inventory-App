import { FaBook } from "react-icons/fa";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import Dropdown from "../component/DropDown";

const Report = () => {
    return (
    <div className="grid">
        <nav>
            <Navigation />
        </nav>
        <main className="flex flex-col my-16">
            <TopBar screen="Reports" />
            <div className="px-2 mb-6 flex flex-col gap-6 items-center justify-center">
                <h1 className="text-4xl font-bold flex items-center justify-center gap-4"><FaBook /> Reports</h1>
                <div className="grid grid-cols-3 w-full">
                    <div className="bg-yellow-500/40 font-bold py-2 px-4 rounded w-full">
                        <h3 className="text-2xl text-center">Sale Reports</h3>
                        <div className="flex gap-4">
                            <label htmlFor="report-frequency">Period:</label>
                            <Dropdown options={["Daily", "Monthly", "Annually"]} />
                        </div>
                        <div className="flex gap-4">
                            <label htmlFor="report-frequency">Period:</label>
                            <Dropdown options={["Daily", "Monthly", "Annually"]} />
                        </div>
                        Generate Report
                    </div>
                </div>
            </div>
        </main>
    </div>
    );
}
export default Report;