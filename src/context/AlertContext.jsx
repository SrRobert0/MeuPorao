import { createContext } from "react";
import { useState } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert]             = useState("");
  const [alertActive, setAlertActive] = useState(false);

  function GetAlert(tabName) {
    setAlert(tabName);
  }

  function GetAlertActive(state) {
    setAlertActive(state);
  }

  return (
    <AlertContext.Provider
      value={{ alert, alertActive, GetAlert, GetAlertActive }}
    >
      {children}
    </AlertContext.Provider>
  );
};