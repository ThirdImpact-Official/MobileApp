import React, { createContext, useContext, useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";

type Severity = "success" | "info" | "warning" | "error";

interface ToastedContextType {
  isvisible: boolean;
  message: string;
  severity: Severity;
  showToast: (message: string, severity?: Severity) => void;
  closeToast: () => void;
}

const ToastedContext = createContext<ToastedContextType | undefined>(undefined);

interface ToastedProviderProps {
  children: React.ReactNode;
}

export const ToastedProvider: React.FC<ToastedProviderProps> = ({ children }) => {
  const [isvisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Severity>("info");

  const showToast = (msg: string, sev: Severity = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setIsVisible(true);
  };

  const closeToast = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isvisible) {
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isvisible]);

  const value: ToastedContextType = {
    isvisible,
    message,
    severity,
    showToast,
    closeToast,
  };

  return (
    <ToastedContext.Provider value={value}>
      {children}
      <Snackbar
        visible={isvisible}
        onDismiss={closeToast}
        duration={3000}
        style={{ backgroundColor: getColorForSeverity(severity) }}
      >
        {message}
      </Snackbar>
    </ToastedContext.Provider>
  );
};

const getColorForSeverity = (severity: Severity): string => {
  switch (severity) {
    case "success":
      return "#4caf50";
    case "info":
      return "#2196f3";
    case "warning":
      return "#ff9800";
    case "error":
      return "#f44336";
    default:
      return "#2196f3";
  }
};

export const useToasted = (): ToastedContextType => {
  const context = useContext(ToastedContext);
  if (!context) {
    throw new Error("useToasted must be used within a ToastedProvider");
  }
  return context;
};
export default ToastedProvider;