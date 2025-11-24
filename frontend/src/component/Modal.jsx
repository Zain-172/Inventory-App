
import { motion as Motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className="fixed z-1000 inset-0 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
