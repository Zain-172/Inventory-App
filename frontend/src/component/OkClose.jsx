import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ModalMessageBox
 * A reusable message box made using a clean modal design.
 * Props:
 * - open: boolean (controls visibility)
 * - title: string
 * - message: string / JSX
 * - onOk: function
 * - onCancel: function (optional)
 * - okLabel: string
 * - cancelLabel: string
 */
export default function ModalMessageBox({
  open,
  title = "Alert",
  message = "Your message goes here...",
  onOk = () => {},
  onCancel = null,
  okLabel = "OK",
  cancelLabel = "Cancel",
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-md p-6 bg-[#111] border-white/40 border shadow-white/5 rounded-2xl shadow-xl z-10"
          >
            {/* Title */}
            <h2 className="text-2xl text-center font-semibold mb-3">{title}</h2>

            {/* Message */}
            <p className="text-center mb-6 leading-relaxed">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-3">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Usage Example:
--------------------------------------------------
import React, { useState } from "react";
import ModalMessageBox from "./ModalMessageBox";

export default function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setOpen(true)}
      >
        Open Message Box
      </button>

      <ModalMessageBox
        open={open}
        title="Information"
        message="This is a clean modal-based message box."
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        okLabel="OK"
        cancelLabel="Close"
      />
    </div>
  );
}
*/
