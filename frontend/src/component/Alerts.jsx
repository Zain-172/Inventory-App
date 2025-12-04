import { createContext, useContext, useState } from "react";
import OkCloseMessageBox from "./OkClose.jsx";
const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    resolve: null,
    title: "Alert"
  });

  function alertBox(message, title = "Alert") {
    return new Promise((resolve) => {
      setAlertState({ open: true, message, resolve, title });
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
        hideCloseButton={true}
        onOk={handleOk}
      />
    </AlertContext.Provider>
  );
}

export function useAlertBox() {
  return useContext(AlertContext);
}
