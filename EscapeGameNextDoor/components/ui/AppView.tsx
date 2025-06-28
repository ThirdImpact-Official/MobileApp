import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View, StatusBar} from 'react-native';
import { Redirect } from "expo-router";
import ParallaxScrollView from "../ParallaxScrollView";
import { useAuth } from '../../context/ContextHook/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { Appbar, Card, Modal, Button, Badge } from "react-native-paper";
import { useRouter } from "expo-router";
import LinearGradientWrap from './linearGradientWrap';
import { ThemedText } from "../ThemedText";
import { UnitofAction } from "@/action/UnitofAction";
import { Timer } from "@mui/icons-material";

interface AppViewProps {
  children: React.ReactNode;
}

export default function AppView({ children }: AppViewProps) {

  const { isAuthenticated, user, logout } = useAuth();
  const [getuser, setuser] = useState<GetUserDto | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [countNotification, setCountNotification] = useState(0);
  // Removed duplicate getUser state - you already have getuser above
  
  const action = new UnitofAction();
  const router = useRouter();

  useEffect(() => {
    const handleNotificationCount = async () => {
      const count = await action.notificationAction.GetNotificationcount();
      if (count.Success) {
        setCountNotification(count.Data as number);
      }
    }

    // Only run if authenticated
    if (isAuthenticated) {
      handleNotificationCount();
      
      const interval = setInterval(() => {
        handleNotificationCount();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]); // Add isAuthenticated as dependency


  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);
  
  const handleLogout = () => {
    logout();
    router.replace('/Authentication/Login');  
  }

  const HandleNotification = () => {
    router.push('/Profile/Notification');
  }

  const handleProfile = () => {
    router.push('/(tabs)/profile');
  }


  if (!isAuthenticated) {
    return <Redirect href='/Authentication/Login' />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <React.Fragment>
            <LinearGradient
              style={styles.gradientHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={['#667eea', '#764ba2', '#f093fb']}
            >
              <View style={styles.logoContainer}>
                <Image 
                  source={require('@/assets/images/escape-game-logo.png')}
                  style={styles.reactLogo} 
                  resizeMode="contain"
                />
                <View style={styles.glowEffect} />
              </View>
            </LinearGradient>
            
          <Appbar style={styles.appbar}>
                <View>
                  <Appbar.Action
                    icon="account"
                    onPress={handleProfile}
                    />
                </View>
                <View>
                <Appbar.Action
                  icon="bell"
                  onPress={HandleNotification}
                  />
                  <Badge
                    size={18}
                    style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'red' }}    
                    visible={countNotification > 0}
                  >
                    {countNotification}
                  </Badge>
                </View>
                <View>
                <Appbar.Action
                  icon="logout"
                  onPress={() => {
                    handleOpenModal();  
                  }}
                  />
                </View>
          </Appbar>
          </React.Fragment> 
        }
      >
        <View style={styles.contentWrapper}>
          {children}
        </View>
      </ParallaxScrollView>
      <Modal visible={isModalVisible} onDismiss={handleCloseModal}>
          <Card>
            <Card.Content>
                <ThemedText style={{ textAlign: 'center' }}>Are you sure you want to logout?</ThemedText>
              </Card.Content>
              <Card.Actions>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    <Button onPress={handleLogout}>Se déconnecter</Button>
                    <Button onPress={handleCloseModal}>fermer </Button>
                  </View>
              </Card.Actions>
          </Card>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  gradientHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  reactLogo: {
    height: 300,
    width: 600,
    tintColor: 'rgba(255, 255, 255, 0.9)',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 10,
  },
  
  glowEffect: {
    position: 'absolute',
    width: 250,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
    zIndex: -1,
  },
  
  appbar: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: '#1a1a2e',
    position: 'absolute',
    margin:0,
    padding:0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  
  stepContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    // Modern shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
});