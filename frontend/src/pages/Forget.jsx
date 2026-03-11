import { lazy, useState } from "react";
const OTP = lazy(() => import("../component/OTP"));
const Modal = lazy(() => import("../component/Modal"));
import { resetPassword } from "../api/Login";
import { useAlertBox } from "../component/Alerts";
import { generateOTP } from "../api/SignUp";
import { useNavigate } from "react-router-dom";

export default function Forget() {
    const { alertBox } = useAlertBox();
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword } = e.target.elements;
        if (password.value !== confirmPassword.value) {
            alertBox("Passwords do not match", "Error", null);
            return;
        }
        const response = await resetPassword(email, password.value);
        console.log(response);
        if (response.success) {
            alertBox("Password reset successful", "Success", null);
            setOpen(false);
            navigate("/")
        } else {
            alertBox("Password reset failed", "Error", null);
        }
    };

    const sendOTP = async () => {
        if (!email) {
            alertBox("Please enter your email", "Error", null);
            return;
        } else {
            await generateOTP(email);
            setIsOpen(true);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <div className="flex items-center justify-center flex-col bg-white shadow-lg p-4 w-full max-w-xl rounded-lg">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <div className="mb-4 w-full">
                    <label className="block">Email</label>
                    <input type="email" name="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
                </div>

                <button type="button" onClick={sendOTP} className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                    Send OTP
                </button>
            </div>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <OTP onSuccess={() => setOpen(true)} />
            </Modal>
            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                        Reset Password
                    </button>
                </form>
            </Modal>
        </div>
    );
}