import { FaRegEye, FaRegEyeSlash, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { login } from "../api/Login";
import { lazy, useState } from "react";
import { useAlertBox } from "../component/Alerts";
const Modal = lazy(() => import("../component/Modal"));
export default function Login() {
  const { alertBox } = useAlertBox();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const response = await login(username, password);
      if (response.login) {
        localStorage.setItem(
          "inventory_user",
          JSON.stringify({
            id: response.id,
            username: response.username,
            email: response.email,
          })
        );
        navigate("/home");
      } else {
        alertBox(response.message, "Login Failed", <FaUserCircle />);
      }
    } catch (error) {
      alertBox(error, "Login Failed", <FaUserCircle />);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-20">
        <main className="dark:bg-neutral-900 bg-white rounded-lg shadow-lg w-full max-w-3xl grid grid-cols-1 md:grid-cols-[0.1fr_1fr_3fr]">
            <div className="bg-green-800 rounded-l-lg"></div>
            <div className="flex flex-col items-center justify-center bg-green-800 text-white rounded-r-full rounded-l-lg pl-6 pr-12">
                <h1 className="text-2xl col-span-2 font-bold text-center mb-4">Login</h1>
                <FaUserCircle className="text-9xl mx-auto mb-4" />
            </div>
            <form className="bg-transparent p-8 rounded-lg" onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block">Username</label>
                    <input type="text" name="username" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Enter your username" />
                </div>
                <div className="relative">
                    <label className="block">Password</label>
                    <input type={show ? "text" : "password"} name="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Enter your password" />
                    <button type="button" onClick={() => setShow((prev) => !prev)} className="text-green-500 hover:text-green-700 mt-2 absolute right-4 top-7">
                        {show ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                </div>
                <button type="button" onClick={() => navigate("/forget-password")} className="text-green-500 hover:text-green-700 mb-4 grid place-self-end">Forgot Password?</button>
                <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors mb-6">Login</button>
                <div>
                    <p className="text-center text-gray-500">Don't have an account? <button type="button" className="text-green-500 hover:text-green-700" onClick={() => navigate("/signup")}>Sign Up</button></p>
                </div>
            </form>
        </main>
    </div>
  );
}