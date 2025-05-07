import { create } from "domain";
import { createContext, useContext,useEffect,useState} from "react";

import { Alert,Snackbar } from "@mui/material";
interface ToastedContextType{
    isvisible: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
    showToast: (message: string, severity: 'success' | 'info' | 'warning' | 'error') => void
    closeToast: () => void
}

export const ToastedContext=createContext<ToastedContextType | undefined>(undefined);
interface ToastedProviderProps{
    children: React.ReactNode;
}


export const ToastedProvider: React.FC<ToastedProviderProps> = (props) => {
    const [isvisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

    const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
        setIsVisible(true);
        setMessage(message);
        setSeverity(severity);
    };
    const closeToast = () => {
        setIsVisible(false);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);


    })
    const value= {
        isvisible,
        message,
        severity,
        showToast,
        closeToast,
    };

    return (<ToastedContext.Provider value={value}>
            {props.children}
            <Snackbar open={isvisible} autoHideDuration={3000} onClose={closeToast}>
                <Alert severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </ToastedContext.Provider>);
}
/**
 * Custom hook to access the toasted context.
 *
 * This hook provides access to the toasted context, allowing components
 * to use toast-related state and functions. It must be used within a
 * component wrapped by `ToastedProvider`.
 *
 * @throws {Error} If the hook is used outside of a `ToastedProvider`.
 *
 * @returns {ToastedContextType} The toasted context value.
 */


export const useToasted=():ToastedContextType => {
    const context=useContext(ToastedContext);
    if(!context)
    {
        throw new Error('useToasted must be used within a ToastedProvider');
    }
    return context;
};

