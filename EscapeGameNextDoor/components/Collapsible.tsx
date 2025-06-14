import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
type CollapsibleProps = PropsWithChildren & {
  title: string;
  isThemed?: boolean;
  startExpanded?: boolean;
  onToggle?: (isOpen: boolean) => void;
  headerStyle?: object;
  contentStyle?: object;
};

export function Collapsible({
  children,
  title,
  isThemed = true,
  startExpanded = false,
  onToggle,
  headerStyle,
  contentStyle
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(startExpanded);
  const theme = useColorScheme() ?? 'light';
  const iconColor = theme === 'light' ? Colors.light.icon : Colors.dark.icon;

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const ContainerComponent = isThemed ? ThemedView : View;
  const TextComponent = isThemed ? ThemedText : Text;

  return (
    <ContainerComponent>
      <TouchableOpacity
        style={[styles.heading, headerStyle]}
        onPress={handleToggle}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={iconColor}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <TextComponent 
          style={isThemed ? undefined : styles.unthemedText}
          type={isThemed ? "defaultSemiBold" : undefined}
        >
          {title}
        </TextComponent>
      </TouchableOpacity>
      
      {isOpen && (
        <ContainerComponent style={[styles.content, contentStyle]}>
          {children}
        </ContainerComponent>
      )}
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
    paddingBottom: 8,
  },
  unthemedText: {
    fontSize: 16,
    color: '#000', // Default text color for unthemed version
  },
});