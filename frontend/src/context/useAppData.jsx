import { useContext } from "react";
import { AppDataContext } from "./AppDataStateContext";

export const useAppData = () => useContext(AppDataContext);
