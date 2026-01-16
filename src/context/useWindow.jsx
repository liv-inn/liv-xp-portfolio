import { useContext } from "react";
import { WindowContext } from "./WindowContext";

export const useWindow = () => {
  const context = useContext(WindowContext);
  if (context === null) {
    throw new Error("useWindow must be used within a WindowProvider");
  }
  return context;
};