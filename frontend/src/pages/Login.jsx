import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-20">
        <main className="bg-white rounded-lg shadow-lg w-full max-w-3xl grid grid-cols-1 md:grid-cols-[0.1fr_1fr_3fr]">
            <div className="bg-green-800 rounded-l-lg"></div>
            <div className="flex flex-col items-center justify-center bg-green-800 text-white rounded-r-full rounded-l-lg pl-6 pr-12">
                <h1 className="text-2xl col-span-2 font-bold text-center mb-4">Login</h1>
                <FaUserCircle className="text-9xl mx-auto mb-4" />
            </div>
            <form className="p-8 rounded-lg">
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Enter your username" />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Enter your password" />
                </div>
                <button type="button" className="text-green-500 hover:text-green-700 mb-4 grid place-self-end">Forgot Password?</button>
                <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors mb-6">Login</button>
                <div>
                    <p className="text-center text-gray-600">Don't have an account? <button type="button" className="text-green-500 hover:text-green-700" onClick={() => navigate("/signup")}>Sign Up</button></p>
                </div>
            </form>
        </main>
    </div>
  );
}