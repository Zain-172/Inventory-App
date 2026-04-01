import { useContext } from "react";
import { AlertContext } from "./AlertContext";

export function useAlertBox() {
  return useContext(AlertContext);
}
