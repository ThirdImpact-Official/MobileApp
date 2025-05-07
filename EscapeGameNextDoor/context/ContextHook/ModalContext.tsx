import { create } from "domain";
import { createContext, useContext,useEffect,useState} from "react";
import { Box, Button, Modal,Typography } from "@mui/material";
import { Alert,Snackbar } from "@mui/material";
import { data } from 'react-router-dom';
interface ModalContextType{
    title:string;
    description:string;
    open:boolean;
    setTitle:(title:string) => void;
    setDescription:(description:string) => void;
    setOpen:(open:boolean) => void;
    handleOpen:() => void;
    handleClose:() => void;
}

export const ModalContext=createContext<ModalContextType | undefined>(undefined);
interface ModalProviderProps{
    children: React.ReactNode;
}


export const ModalProvider: React.FC<ModalProviderProps> = (props) => {
    const[open,setOpen] = useState(false);
    const [description,setDescription] = useState("");
    const [title,setTitle] = useState("");
   
    const handleOpen=()=>{setOpen(true);};
    const handleClose=()=>{setOpen(false);};

   

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
        }, 3000);


    })
    
    const value= {
        title,
        description,
        open,
        setTitle,
        setDescription,
        setOpen,
        handleOpen,
        handleClose
    };

    return (
        <ModalContext.Provider value={value}>
            {props.children}
                <Modal
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        borderRadius: 3,
                        boxShadow: 8,
                        p: 4,
                        width: { xs: "90%", sm: 400 },
                        maxHeight: "90vh",
                        overflowY: "auto",
                    }}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                <Box >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {description}
                    </Typography>
                </Box>
                </Modal>
        </ModalContext.Provider>);
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


export const useModal=():ModalContextType => {
    const context=useContext(ModalContext);
    if(!context)
    {
        throw new Error('useToasted must be used within a ToastedProvider');
    }
    return context;
};

