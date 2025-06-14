import React from "react";
import { View, Image, StyleSheet, Touchable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { List ,Card, Divider } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divide } from "react-native-feather";
import { ThemedView } from "@/components/ThemedView";
interface ItemDisplayProps {
  letter?: string;
  name?: string;
  header?: string;
  img?: string;
  onClick?: () => void;
}

const ItemDisplay: React.FC<ItemDisplayProps> = ({ 
  letter = "?", 
  name = "Non spécifié", 
  header = "Titre", 
  img, 
  onClick 
}) => {
  const handlePress = () => {
    onClick?.();
  };
 const [expandedId, setExpandedId] = React.useState<number | null>(null);
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}> 
        <Card>
      <List.Item
        title={name}
        description={header}
        left={() => (
          <ThemedView style={styles.avatar}>
            <MaterialIcons name="lock" size={24} color="#000" />
          </ThemedView>
        )}
        right={() => (
          <ThemedView style={styles.rightContainer}>
            {img ? (
              <Image source={{ uri: img }} style={styles.image} />
            ) : (
              <ThemedView style={styles.placeholder}>
                <MaterialIcons name="image" size={24} color="#7a7a8c" />
              </ThemedView>
            )}
          </ThemedView>
        )}
      />
     
      </Card>
    </TouchableOpacity>
 
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#17141d",
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  avatar: {
    paddingLeft: 12,
    paddingTop: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 16,
  },
  header: {
    color: "#e52e71",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  name: {
    color: "#7a7a8c",
    fontSize: 14,
  },
  rightContainer: {
    width: 80,
    height: 60,
    marginLeft: 12,
  },
  image: {

    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 4,
  },
});

export default ItemDisplay;