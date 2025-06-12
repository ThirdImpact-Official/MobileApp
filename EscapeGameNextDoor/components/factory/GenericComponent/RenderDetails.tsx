import React, { FC, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Portal, Modal, Provider as PaperProvider } from "react-native-paper";

interface ModalProps {
  ButtonColor?: "primary" | "secondary" | "error" | "info" | "warning" | "success";
  ButtonTitle?: string;
  children: React.ReactNode;
  Title: string;
  Description: string;
  Method?: () => void;
}

const ModalComponent: FC<ModalProps> = ({
  ButtonTitle = "Open Modal",
  ButtonColor = "primary",
  Title,
  Description,
  children,
  Method,
}) => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
    Method?.();
  };

  const handleClose = () => setVisible(false);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Button mode="contained" onPress={handleOpen} buttonColor={getColor(ButtonColor)}>
          {ButtonTitle}
        </Button>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={handleClose}
            contentContainerStyle={styles.modalContent}
          >
            <ScrollView>
              <Text variant="titleLarge" style={styles.title}>
                {Title}
              </Text>
              <Text style={styles.description}>{Description}</Text>
              <View style={{ marginTop: 20 }}>{children}</View>
              <Button mode="contained" onPress={handleClose} style={styles.closeButton}>
                Fermer
              </Button>
            </ScrollView>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

// Utilitaire de couleur (tu peux adapter selon ton thème)
const getColor = (color: string) => {
  switch (color) {
    case "primary":
      return "#6200ee";
    case "secondary":
      return "#03dac6";
    case "success":
      return "#4caf50";
    case "error":
      return "#f44336";
    case "warning":
      return "#ff9800";
    case "info":
      return "#2196f3";
    default:
      return "#6200ee";
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: "90%",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    color: "#666",
  },
  closeButton: {
    marginTop: 30,
    alignSelf: "center",
  },
});

export default ModalComponent;
