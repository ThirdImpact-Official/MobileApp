import { Dialog, DialogTitle,DialogActions,DialogContent, Button, Menu, MenuItem, Select } from '@mui/material';
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ModalComponent from './Modal';

export interface GenericMenuItemProps {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    showBadge?: boolean;
    color?:string;
    modalTitle?:string;
    modalContent?: React.ReactNode;
}

export interface GenericMenuProps {
    items: GenericMenuItemProps[];
    menuIcon?: React.ReactNode; // Permet d'afficher une icône personnalisée
    ariaLabel?: string; // Ajout pour l'accessibilité
}

const GenericMenu = ({ items, menuIcon = <MenuIcon />, ariaLabel = "Menu" }: GenericMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [Select, setSelect] = useState<GenericMenuItemProps | null>(null);
    const [modalTitle,setModaltitle] = useState<string | null>(null);
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalAction, setModalAction] = useState<() => void>(() => () => {}); // Action à exécuter lors de la confirmation du modal
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleModalClose = () => {
        setOpenModal(false);
        setModalContent(null); // On nettoie le contenu du modal
    };

    const handleMenuItemClick= (item:GenericMenuItemProps)=> {
        if(item.modalContent){
            setModalContent(item.modalContent);
            setModalAction(item.onClick);
            setModaltitle(item.modalTitle || "");
            setOpenModal(true);
        }
        else{
            item.onClick();
            handleClose();
        }
    }
    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                aria-label={ariaLabel} // Accessibilité améliorée
            >
                {menuIcon}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
                {items.map((item, index) => (
                    <MenuItem sx={{'color': item.color}}
                               key={index} 
                               onClick={() => handleMenuItemClick(item)}>
                        {item.icon}
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>

             {/* Affichage dynamique du modal */}
             {modalContent && (
                <Dialog open={openModal} onClose={handleModalClose}>
                    <DialogTitle>{modalTitle}</DialogTitle>
                    <DialogContent>
                        {modalContent}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose}>Annuler</Button>
                        <Button
                                onClick={() => {
                                modalAction(); // Utiliser l'action stockée
                                handleModalClose();
                                }}
                                color="primary"
                            >
                            Confirmer
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default GenericMenu;
