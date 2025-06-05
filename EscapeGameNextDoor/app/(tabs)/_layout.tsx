import { Tabs } from 'expo-router';
import { Platform, Image, ActivityIndicator, Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { HapticTab } from '@/components/HapticTab';
import { AuthProvider } from '@/context/ContextHook/AuthContext';
import { useAuth } from '@/context/ContextHook/AuthContext';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Redirect } from 'expo-router';
import {styles} from '../../constants/styles';
import { NotificationsOutlined, Person, Person2 } from '@mui/icons-material';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const myStyles=styles;
  if(isLoading) {
    return (
      <>
        <ParallaxScrollView 
          headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
          headerImage={<Image 
            source={require('@/assets/images/partial-react-logo.png')} 
            style={myStyles.headerImage} />}
          >
            <ActivityIndicator size="large" color="#0000ff" />
            <Text> Loading...</Text>
            <Text>Chargement...</Text>
          </ParallaxScrollView>
      </>
    )
  }

  if(!isAuthenticated) {
    return <Redirect href="../Authentication/Login" />    
  }
  else{
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderTopWidth: 0,
            height: Platform.select({
              ios: 80,
              android: 60,
            }),
            paddingBottom: Platform.select({
              ios: 20,
              android: 0,
            }),
          },
          tabBarItemStyle: {
            paddingVertical: 8,
          },
        }}
        >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
          />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
          />
        <Tabs.Screen
          name="Notification"
          options={{
            title: 'Notification',
            tabBarIcon: ({ color }) => (
              <>
              <IconSymbol size={28} name="bell" color={color} />
              <ThemedView>
                <ThemedText>
                  <NotificationsOutlined />
                  </ThemedText>
              </ThemedView>
              </>
            ),
          }}
          />
             <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <>
              <IconSymbol size={28} name="person.fill" color={color} />
              <ThemedView>
                <ThemedText>
                  <Person2 />
                </ThemedText>
              </ThemedView>
              </>
            ),
          }}
          />
      </Tabs>
      
    );

  }
}