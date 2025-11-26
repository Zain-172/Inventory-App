import { motion as Motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="modal-wrapper">
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            key="modal-bg"
            className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ pointerEvents: isOpen ? "auto" : "none" }}
          >
            <Motion.div
              key="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
