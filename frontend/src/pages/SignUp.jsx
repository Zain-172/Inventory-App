import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { lazy, useState } from "react";
const OTP = lazy(() => import("../component/OTP"));
const MessageBox = lazy(() => import("../component/MessageBox"));
const Modal = lazy(() => import("../component/Modal"));
import { signUp, generateOTP } from "../api/SignUp";

export default function SignUp() {
  const navigate = useNavigate();
  const [otpOpen, setOtpOpen] = useState(false);
  const [data, setData] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, username, password, confirmPassword } = e.target.elements;
    // if (password.value !== confirmPassword.value) {
    //   // You can show an error message to the user here
    //   return;
    // }
    console.log(email.value, username.value, password.value, confirmPassword.value);
    await generateOTP(email.value);
    setData({ email: email.value, username: username.value, password: password.value });
    setOtpOpen(true);
  }
  const signUpUser = async () => {
    try {
      const response = await signUp(data);
      console.log("Sign up successful:", response);
      if (response) {
        setOtpOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      // You can show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-20">
      <main className="dark:bg-neutral-900 bg-white rounded-lg shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-[0.1fr_1fr_3fr]">
        <div className="bg-green-800 rounded-l-lg"></div>
        <div className="flex flex-col items-center justify-center bg-green-800 text-white rounded-r-full rounded-l-lg pl-6 pr-12">
          <h1 className="text-2xl col-span-2 font-bold text-center mb-4">
            Sign Up
          </h1>
          <FaUserCircle className="text-9xl mx-auto mb-4" />
        </div>
        <form className="p-8 rounded-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label className="block">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors mb-6"
          >
            Sign Up
          </button>
          <div>
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="text-green-500 hover:text-green-700"
                onClick={() => navigate("/")}
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </main>
      <Modal isOpen={otpOpen} onClose={() => setOtpOpen(false)}>
        <OTP onSuccess={signUpUser} />
      </Modal>
    </div>
  );
}
