import Modal from "./Modal";

export default function MessageBox({ isOpen, onClose, onConfirm, message, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#181818] text-white flex flex-col gap-4 items-center justify-center rounded-xl backdrop-blur-md w-100 border border-white/20" style={{ padding: "1rem" }}>
        {children}
        <div className="flex gap-8">
          <button onClick={onClose} className="rounded-lg font-bold w-24 bg-[#333] hover:bg-[#444] transition-all duration-300 text-white px-4 py-1">Cancel</button>
          <button onClick={() => message === "Delete" ? onConfirm() : onClose()} className="rounded-lg font-bold w-24 bg-[#333] hover:bg-[#444] transition-all duration-300 px-4 py-1 text-[rgb(255,20,20)]">Delete</button>
        </div>
      </div>
    </Modal>
  );
}
