import { useRef } from "react";
import { useAlertBox } from "./useAlertBox.jsx";
import { validateOTP } from "../api/SignUp.js";
export default function OTP({ onSuccess }) {
  const inputs = useRef([]);
  const { alertBox } = useAlertBox();

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.length === 1 && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    } else if (value.length === 0 && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = inputs.current.map(input => input.value).join('');
    const success = await validateOTP(otp);
    console.log(success);
    if (success.valid) {
      alertBox("OTP validated successfully.", "Success");
      onSuccess();
    } else {
      alertBox(success.message, "Error");
    }
  }

  return (
    <form className="p-6 bg-white dark:bg-neutral-900 rounded-xl" onSubmit={handleSubmit} >
        <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
          Please enter the 6-digit code sent to your email or phone.
        </p>
        <div className="flex gap-3 mb-2">
          {[0,1,2,3,4,5].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              ref={(el) => (inputs.current[i] = el)}
              onChange={(e) => handleChange(e, i)}
              className="w-12 h-12 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          ))}
        </div>
        <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
          Verify OTP
        </button>
    </form>
  );
}
