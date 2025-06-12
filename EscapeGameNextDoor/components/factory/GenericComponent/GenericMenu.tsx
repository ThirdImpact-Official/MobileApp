import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";

// Icône par défaut (vous pouvez utiliser react-native-vector-icons ou une autre lib)
const MenuIcon = () => (
  <View style={styles.defaultMenuIcon}>
    <View style={styles.menuLine} />
    <View style={styles.menuLine} />
    <View style={styles.menuLine} />
  </View>
);

export interface GenericMenuItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  showBadge?: boolean;
  color?: string;
  modalTitle?: string;
  modalContent?: React.ReactNode;
}

export interface GenericMenuProps {
  items: GenericMenuItemProps[];
  menuIcon?: React.ReactNode;
  ariaLabel?: string;
  buttonStyle?: object;
  menuStyle?: object;
  itemStyle?: object;
  modalStyle?: object;
  position?: 'bottom' | 'center'; // Position du menu
}

const GenericMenu = ({ 
  items, 
  menuIcon = <MenuIcon />, 
  ariaLabel = "Menu",
  buttonStyle,
  menuStyle,
  itemStyle,
  modalStyle,
  position = 'bottom'
}: GenericMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GenericMenuItemProps | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState<() => void>(() => () => {});

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setModalContent(null);
    setModalTitle(null);
  };

  const handleMenuItemClick = (item: GenericMenuItemProps) => {
    setIsMenuOpen(false); // Fermer le menu d'abord
    
    if (item.modalContent) {
      setModalContent(item.modalContent);
      setModalAction(() => item.onClick);
      setModalTitle(item.modalTitle || "");
      setOpenModal(true);
    } else {
      item.onClick();
    }
  };

  const handleConfirmModal = () => {
    modalAction();
    handleModalClose();
  };

  // Menu en bas de l'écran
  const renderBottomMenu = () => (
    <Modal
      visible={isMenuOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={handleMenuClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleMenuClose}
      >
        <View style={[styles.bottomMenuContainer, menuStyle]}>
          <View style={styles.bottomMenuHandle} />
          <ScrollView style={styles.menuScrollView}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, itemStyle]}
                onPress={() => handleMenuItemClick(item)}
                accessibilityLabel={item.label}
                accessibilityRole="button"
              >
                <View style={styles.menuItemIcon}>
                  {item.icon}
                </View>
                <Text style={[
                  styles.menuItemText,
                  { color: item.color || '#333' }
                ]}>
                  {item.label}
                </Text>
                {item.showBadge && (
                  <View style={styles.badge} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Menu au centre de l'écran
  const renderCenterMenu = () => (
    <Modal
      visible={isMenuOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={handleMenuClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleMenuClose}
      >
        <View style={[styles.centerMenuContainer, menuStyle]}>
          <ScrollView style={styles.menuScrollView}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, itemStyle]}
                onPress={() => handleMenuItemClick(item)}
                accessibilityLabel={item.label}
                accessibilityRole="button"
              >
                <View style={styles.menuItemIcon}>
                  {item.icon}
                </View>
                <Text style={[
                  styles.menuItemText,
                  { color: item.color || '#333' }
                ]}>
                  {item.label}
                </Text>
                {item.showBadge && (
                  <View style={styles.badge} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Modal de confirmation
  const renderConfirmationModal = () => (
    <Modal
      visible={openModal}
      transparent={true}
      animationType="fade"
      onRequestClose={handleModalClose}
    >
      <View style={styles.confirmModalOverlay}>
        <View style={[styles.confirmModalContainer, modalStyle]}>
          <Text style={styles.confirmModalTitle}>
            {modalTitle}
          </Text>
          
          <View style={styles.confirmModalContent}>
            {modalContent}
          </View>
          
          <View style={styles.confirmModalActions}>
            <TouchableOpacity
              style={[styles.confirmButton, styles.cancelButton]}
              onPress={handleModalClose}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.confirmButton, styles.primaryButton]}
              onPress={handleConfirmModal}
            >
              <Text style={styles.primaryButtonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.menuButton, buttonStyle]}
        onPress={handleMenuToggle}
        accessibilityLabel={ariaLabel}
        accessibilityRole="button"
        accessibilityHint="Ouvre le menu"
      >
        {menuIcon}
      </TouchableOpacity>

      {position === 'bottom' ? renderBottomMenu() : renderCenterMenu()}
      {renderConfirmationModal()}
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Bouton menu
  menuButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Icône par défaut
  defaultMenuIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
  },

  // Overlay modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  // Menu en bas
  bottomMenuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    paddingBottom: 20,
  },
  bottomMenuHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },

  // Menu au centre
  centerMenuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: height * 0.6,
    alignSelf: 'center',
  },

  // Contenu du menu
  menuScrollView: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIcon: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
    marginLeft: 8,
  },

  // Modal de confirmation
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  confirmModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: height * 0.7,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  confirmModalContent: {
    marginBottom: 24,
    maxHeight: height * 0.4,
  },
  confirmModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default GenericMenu;