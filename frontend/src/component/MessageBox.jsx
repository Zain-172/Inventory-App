import Modal from "./Modal";

export default function MessageBox({ isOpen, onClose, onConfirm, message, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-neutral-900 text-black flex flex-col gap-4 items-center justify-center rounded-xl backdrop-blur-md w-100 border border-white/20" style={{ padding: "1rem" }}>
        {children}
        <div className="flex gap-8">
          <button onClick={onClose} className="rounded-lg font-bold w-24 bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white px-4 py-1">Cancel</button>
          <button onClick={() => message === "Delete" ? onConfirm() : onClose()} className="rounded-lg font-bold w-24 bg-red-600 hover:bg-red-700 transition-all duration-300 px-4 py-1 text-white">Delete</button>
        </div>
      </div>
    </Modal>
  );
}
