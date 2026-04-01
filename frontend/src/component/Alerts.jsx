import { useState } from "react";
import OkCloseMessageBox from "./OkClose.jsx";
import { FaExclamationCircle } from "react-icons/fa";
import { AlertContext } from "./AlertContext";

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    resolve: null,
    title: "Alert",
    icon: <FaExclamationCircle />,
    hideCloseButton: true,
  });

  function alertBox(message, title = "Alert", icon = <FaExclamationCircle />, hideCloseButton = true) {
    return new Promise((resolve) => {
      setAlertState({ open: true, message, resolve, title, icon, hideCloseButton });
    });
  }

  function handleOk() {
    alertState.resolve?.(true); // return control back
    setAlertState({ ...alertState, open: false });
  }
  function handleCancel() {
    alertState.resolve?.(false); // return control back
    setAlertState({ ...alertState, open: false });
  }

  return (
    <AlertContext.Provider value={{ alertBox }}>
      {children}

      <OkCloseMessageBox
        open={alertState.open}
        title={alertState.title}
        message={alertState.message}
        icon={alertState.icon}
        hideCloseButton={alertState.hideCloseButton}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </AlertContext.Provider>
  );
}
