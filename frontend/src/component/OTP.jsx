import { useRef } from "react";
import { useAlertBox } from "./Alerts.jsx";
export default function OTP({ onSuccess, OTP }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = inputs.current.map(input => input.value).join('');
    console.log("Submitted OTP:", otp);
    if (otp === OTP) {
      onSuccess();
    } else {
      alertBox("Invalid OTP. Please try again.");
    }
  }

  return (
    <form className="p-6 bg-white dark:bg-neutral-900 rounded-xl" onSubmit={handleSubmit} >
        <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
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
