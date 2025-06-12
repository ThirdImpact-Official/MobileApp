import React, { createContext, useContext, useState } from "react";
import { View, Modal, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = (value: boolean) => setIsLoading(value);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading }}>
      {children}
      <Modal
        transparent
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => showLoading(false)}
      >
        <View style={styles.backdrop}>
          <ActivityIndicator size="large" color="#8884d8" />
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default LoadingProvider;