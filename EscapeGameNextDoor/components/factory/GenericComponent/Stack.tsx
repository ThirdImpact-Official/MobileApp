import React, { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Menu, Button, Text } from "react-native-paper";

interface SelectGenericProps<T> {
  data: T[];
  columns: { label: string; accessor: keyof T }[];
  OnChange: (data: T) => void;
}

const SelectGeneric = <T extends { id: number }>({
  data,
  columns,
  OnChange,
}: SelectGenericProps<T>) => {
  const [visible, setVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(data[0]?.id ?? 0);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const selectedItem = data.find((item) => item.id === selectedItemId);

  const handleSelect = (item: T) => {
    setSelectedItemId(item.id);
    OnChange(item);
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button mode="outlined" onPress={openMenu}>
            {columns.map((col) => selectedItem?.[col.accessor]).join(", ") || "Sélectionner"}
          </Button>
        }
      >
        {data.map((item) => (
          <Menu.Item
            key={item.id}
            onPress={() => handleSelect(item)}
            title={columns.map((col) => item[col.accessor]).join(", ")}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: "flex-start",
  },
});

export default SelectGeneric;
