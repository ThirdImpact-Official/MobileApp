import { Button, Modal, Text } from "react-native-paper";
import { View, ViewStyle } from 'react-native';
import React, { FC, useState } from "react";

interface ModalProps {
  ButtonColor?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  ButtonTitle?: string;
  children: React.ReactNode;
  Title: string;
  Description: string;
  Method?: () => void;
}

const ModalComponent: FC<ModalProps> = ({ 
  children, 
  Method, 
  ButtonTitle = "Open Modal", 
  Title, 
  Description, 
  ButtonColor = "primary" 
}) => {
  const [visible, setVisible] = useState(false);
  
  const handleOpen = () => {
    setVisible(true);
    if (Method !== undefined) {
      Method();
    }
  };

  const handleClose = () => setVisible(false);

  // Modal container style
  const containerStyle: ViewStyle = {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  };

  return (
    <>
      <Button
        mode="contained"
        onPress={handleOpen}
        buttonColor={getButtonColor(ButtonColor)}
      >
        {ButtonTitle}
      </Button>

      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={containerStyle}
      >
        <View>
          <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
            {Title}
          </Text>
          
          {Description && (
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              {Description}
            </Text>
          )}
          
          {children && (
            <View style={{ marginBottom: 16 }}>
              {children}
            </View>
          )}
          
          <Button
            mode="outlined"
            onPress={handleClose}
          >
            Fermer
          </Button>
        </View>
      </Modal>
    </>
  );
};

// Helper function to map color props to actual colors
const getButtonColor = (color: string): string => {
  switch (color) {
    case "primary":
      return "#6200ee";
    case "secondary":
      return "#03dac6";
    case "success":
      return "#4caf50";
    case "error":
      return "#f44336";
    case "info":
      return "#2196f3";
    case "warning":
      return "#ff9800";
    default:
      return "#6200ee";
  }
};

export default ModalComponent;