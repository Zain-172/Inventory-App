import { createContext, useContext, useState } from "react";
import OkCloseMessageBox from "./OkClose.jsx";
import { FaExclamationCircle } from "react-icons/fa";
const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    resolve: null,
    title: "Alert",
    icon: <FaExclamationCircle />,
  });

  function alertBox(message, title = "Alert", icon = <FaExclamationCircle />) {
    return new Promise((resolve) => {
      setAlertState({ open: true, message, resolve, title, icon });
    });
  }

  function handleOk() {
    alertState.resolve?.(); // return control back
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
        hideCloseButton={true}
        onOk={handleOk}
      />
    </AlertContext.Provider>
  );
}

export function useAlertBox() {
  return useContext(AlertContext);
}
