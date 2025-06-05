import { Button, Modal, Typography, Box, Fade, Backdrop } from "@mui/material";
import React, { FC, useState } from "react";

  

interface ModalProps {
    ButtonColor?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
    ButtonTitle?: string;
    children: React.ReactNode;
    Title: string;
    Description: string;
    Method?:() => void;
}



  const ModalComponent: FC<ModalProps> = ({ children, Method, ButtonTitle = "Open Modal", Title, Description,ButtonColor }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () =>{
      setOpen(true);
      if(Method !== undefined)
      {
        Method();
      }
    } 
    const handleClose = () => setOpen(false);
  
    return (
      <>
        <Button variant="contained"
                color={ButtonColor} 
                onClick={handleOpen}>
          {ButtonTitle}
        </Button>
  
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box
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
            >
              <Typography variant="h6" component="h2" textAlign="center">
                {Title}
              </Typography>
  
              {Description && (
                <Typography sx={{ mt: 2, textAlign: "center" }}>
                  {Description}
                </Typography>
              )}
  
              {children && (
                <Box sx={{ mt: 3 }}>
                  {children}
                </Box>
              )}
  
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button variant="contained" 
                        color={"primary" }
                        onClick={handleClose}>
                  Fermer
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </>
    );
  };
  
  export default ModalComponent;
  