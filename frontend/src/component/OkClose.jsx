import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ModalMessageBox({
  open,
  title = "Alert",
  icon= <FaExclamationTriangle />,
  message = "Your message goes here...",
  onOk = () => {},
  onCancel = null,
  okLabel = "OK",
  cancelLabel = "Cancel",
}) {
  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={onCancel || onOk}
          />

          {/* Modal box */}
          <Motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-[370px] p-6 bg-[#111] border-white/40 border shadow-white/5 rounded-2xl shadow-md z-10"
          >
            {/* Title */}
              <h2 className={`flex items-center gap-2 text-xl font-semibold mb-3 ${title === "Success" ? "text-green-500" : "text-yellow-500"}`}>{icon}{title}</h2>

            {/* Message */}
            <p className=" mb-6 leading-relaxed">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0b0b0b] hover:brightness-95"
                >
                  {cancelLabel}
                </button>
              )}

              <button
                onClick={onOk}
                className="px-4 py-2 rounded-xl bg-[#333] min-w-20 text-white font-semibold hover:bg-indigo-700"
              >
                {okLabel}
              </button>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
