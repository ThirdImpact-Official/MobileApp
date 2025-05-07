import { Backdrop, CircularProgress } from "@mui/material";

import { createContext,useContext,useState } from "react";
interface LosadingContextType{
   isLoading: boolean;
   showLoading:boolean;
}

export const LoadingContext=createContext<LosadingContextType | undefined>(undefined);

interface LoadingProviderProps{
    children: React.ReactNode
}
export const LoadingProvider=({children}:LoadingProviderProps)=>{
    const [isLoading,setIsLoading]=useState(false);
    const [showLoading,setShowLoading] = useState(false);
    
    const handleShowLoading = () => setShowLoading(true);
    const value={
        isLoading,
        showLoading,
    }
    return(
        <LoadingContext.Provider value={value}>
            {children}
            <Backdrop 
                open={isLoading}
                onClick={handleShowLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </LoadingContext.Provider>
    )
}


export const useLoading=():LosadingContextType => {
    const context=useContext(LoadingContext);
    if(!context){
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}