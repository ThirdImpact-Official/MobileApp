import React, { useMemo, useState, useRef, useEffect } from "react";
import { 
  Text, 
  View, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions 
} from "react-native";
import { Bell } from 'react-native-feather';

import { GetNotificationDto } from "@/interfaces/NotificationInterface/Notification/getNotificationDto";
import UserNotificationComponent from "../Notification/NotificationItem";
import NotificationDetail from "../Notification/NotificationDetail";
import { UnitofAction } from "@/action/UnitofAction";
import { useToasted } from "@/context/ContextHook/ToastedContext";

const { width, height } = Dimensions.get('window');



interface TabItem {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

// Composant GenericTabs simple pour React Native
const GenericTabs = ({ 
  tabs, 
  defaultTab = 0, 
  onTabChange 
}: { 
  tabs: TabItem[]; 
  defaultTab?: number; 
  onTabChange?: (index: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  return (
    <View style={styles.tabContainer}>
      {/* Tab Headers */}
      <View style={styles.tabHeader}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              activeTab === index && styles.activeTabButton
            ]}
            onPress={() => handleTabPress(index)}
          >
            <View style={styles.tabButtonContent}>
              {tab.icon}
              <Text style={[
                styles.tabButtonText,
                activeTab === index && styles.activeTabButtonText
              ]}>
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {tabs[activeTab]?.content}
      </View>
    </View>
  );
};

// Composant ParallaxScrollView simplifié
const ParallaxScrollView = ({ 
  children, 
  headerImage, 
  headerBackgroundColor 
}: { 
  children: React.ReactNode;
  headerImage?: React.ReactNode;
  headerBackgroundColor?: { light: string; dark: string };
}) => (
  <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
    <View style={[styles.header, { backgroundColor: headerBackgroundColor?.light || '#D0D0D0' }]}>
      {headerImage}
    </View>
    <View style={styles.content}>
      {children}
    </View>
  </ScrollView>
);

export default function Notification() {
  const [notificationTab, setNotificationTab] = useState<GetNotificationDto[] | null>();
  const [selectNotification, setSelectNotification] = useState<GetNotificationDto | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const httpAction = new UnitofAction();
  const Toasted = useToasted();

  const handleOnDetails = (item: GetNotificationDto) => {
    console.log("notification page : ", item);
    setSelectNotification(item);
    console.log("item setted", selectNotification);
    setActiveTab(1); // Switch to details tab
  };

  const tabs: TabItem[] = [
    {
      label: "Notifications",
      icon: <Bell color="#666" style={{ marginRight: 8 }} />,
      content: (
        <UserNotificationComponent 
          onDetails={handleOnDetails}
          dataTable={notificationTab ?? []}
        />
      )
    },
    {
      label: "Détails",
      content: <NotificationDetail data={selectNotification} />
    }
  ];

  const fetchNotifications = async () => {
    try {
      const response = await httpAction.notificationAction.getAllNotifications(page, 5);

      if (response.Success) {
        setNotificationTab(response.Data as GetNotificationDto[]);
        Toasted.showToast('Notifications fetched successfully', 'success');
      } else {
        Toasted.showToast(`Failed to fetch notifications: ${response.Message}`, "error");
        console.error('Error fetching notifications:', response.Message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Toasted.showToast('Failed to fetch notifications', "error");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image 
          source={require('@/assets/images/partial-react-logo.png')} 
          style={styles.headerImage} 
        />
      }
    >
      <View style={styles.container}>
        {/* Main Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Notifications</Text>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Gérez vos notifications</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabSection}>
          <GenericTabs 
            tabs={tabs}
            defaultTab={0}
            onTabChange={(index) => setActiveTab(index)}
          />
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  tabSection: {
    flex: 1,
  },
  
  // Tab Styles
  tabContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#007AFF',
    backgroundColor: 'white',
  },
  tabButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
});