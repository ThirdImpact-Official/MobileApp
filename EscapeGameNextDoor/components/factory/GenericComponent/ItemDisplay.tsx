import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Ou @react-native-vector-icons/MaterialIcons
// Ou adapte selon ton stack (expo ou pas)

interface ItemDisplayProps {
  letter?: string;
  name?: string;
  header?: string;
  img?: string;
  onClick?: () => void;
}

const ItemDisplay: React.FC<ItemDisplayProps> = ({ letter, name, header, img, onClick }) => {
  const handleClick = () => {
    onClick?.() ?? console.log("Item clicked");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      {/* Left Side */}
      <View style={styles.leftContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{letter}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.header}>{header}</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.rightContainer}>
        {img ? (
          <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="lock-clock" size={24} color="#e52e71" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#17141d",
    borderRadius: 8,
    padding: 8,
    margin: 8,
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#333",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#000",
    fontWeight: "500",
  },
  textContainer: {
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  header: {
    color: "#e52e71",
    fontWeight: "600",
    fontSize: 16,
  },
  name: {
    color: "#7a7a8c",
    fontSize: 14,
  },
  rightContainer: {
    width: 80,
    borderLeftWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    height: "100%",
  },
});

export default ItemDisplay;
