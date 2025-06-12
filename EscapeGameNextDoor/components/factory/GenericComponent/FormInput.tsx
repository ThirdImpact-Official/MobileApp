import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface FormInputProps {
  label: string;
  name: string;
  value: string | number | boolean | any | null;
  type?: "text" | "email" | "number" | "select" | "checkbox" | "file";
  options?: { label: string; value: string | number }[];
  onChange: (name: string, value: string | number | boolean | any | null) => void;
  placeholder?: string;
  inputStyle?: object;
  labelStyle?: object;
  containerStyle?: object;
  selectStyle?: object;
  checkboxStyle?: object;
  fileButtonStyle?: object;
}

/**
 * FormInput is a reusable component that renders a form input based on the provided `type` prop.
 * The component automatically handles the input change event and calls the `onChange` function
 * with the name of the input and the new value. The component also handles the rendering of the
 * input based on the type. For example, if the type is "select", the component will render a
 * custom picker modal with the provided options. If the type is "checkbox", the component will
 * render a touchable checkbox. If the type is "file", the component will render a button
 * that opens the device's file picker.
 */
const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  name, 
  value, 
  type = "text", 
  options, 
  onChange,
  placeholder,
  inputStyle,
  labelStyle,
  containerStyle,
  selectStyle,
  checkboxStyle,
  fileButtonStyle
}) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleTextChange = (text: string) => {
    if (type === "number") {
      const numValue = text === "" ? "" : Number(text);
      onChange(name, numValue);
    } else {
      onChange(name, text);
    }
  };

  const handleSelectOption = (optionValue: string | number) => {
    onChange(name, optionValue);
    setIsSelectOpen(false);
  };

  const handleCheckboxToggle = () => {
    onChange(name, !value);
  };

  const handleFilePicker = async () => {
    Alert.alert(
      "Sélectionner un fichier",
      "Choisissez une option",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Galerie", onPress: pickImageFromGallery },
        { text: "Appareil photo", onPress: pickImageFromCamera },
        { text: "Documents", onPress: pickDocument },
      ]
    );
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onChange(name, result.assets[0]);
    }
  };

  const pickImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission refusée", "L'accès à l'appareil photo est requis.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onChange(name, result.assets[0]);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        onChange(name, result.assets[0]);
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  const getSelectedLabel = () => {
    const selectedOption = options?.find(option => option.value === value);
    return selectedOption ? selectedOption.label : "Sélectionner...";
  };

  const renderSelectModal = () => (
    <Modal
      visible={isSelectOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsSelectOpen(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsSelectOpen(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{label}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  value === item.value && styles.selectedOption
                ]}
                onPress={() => handleSelectOption(item.value)}
              >
                <Text style={[
                  styles.optionText,
                  value === item.value && styles.selectedOptionText
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      
      {type === "select" ? (
        <>
          <TouchableOpacity
            style={[styles.selectButton, selectStyle]}
            onPress={() => setIsSelectOpen(true)}
          >
            <Text style={[
              styles.selectText,
              !value && styles.placeholderText
            ]}>
              {getSelectedLabel()}
            </Text>
            <Text style={styles.selectArrow}>▼</Text>
          </TouchableOpacity>
          {renderSelectModal()}
        </>
      ) : type === "checkbox" ? (
        <TouchableOpacity
          style={[styles.checkboxContainer, checkboxStyle]}
          onPress={handleCheckboxToggle}
        >
          <View style={[
            styles.checkbox,
            value && styles.checkboxChecked
          ]}>
            {value && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
      ) : type === "file" ? (
        <TouchableOpacity
          style={[styles.fileButton, fileButtonStyle]}
          onPress={handleFilePicker}
        >
          <Text style={styles.fileButtonText}>
            {value ? `Fichier sélectionné: ${value.name || 'Fichier'}` : label}
          </Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={[styles.textInput, inputStyle]}
          value={value?.toString() || ""}
          onChangeText={handleTextChange}
          placeholder={placeholder || `Entrez ${label.toLowerCase()}`}
          keyboardType={
            type === "email" ? "email-address" :
            type === "number" ? "numeric" : "default"
          }
          autoCapitalize={type === "email" ? "none" : "sentences"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  selectArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '60%',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  fileButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9ff',
    alignItems: 'center',
  },
  fileButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default FormInput;