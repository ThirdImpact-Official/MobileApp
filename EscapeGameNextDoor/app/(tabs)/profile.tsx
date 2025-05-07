import { Collapsible } from "@/components/Collapsible";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme,View ,Image,StyleSheet,Text,ActivityIndicator} from "react-native";
import { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Reservation from "@/components/app/Profile/Reservation";
import Login from "../Authentication/Login";
import { AuthProvider, useAuth } from "@/context/ContextHook/AuthContext";
import { Box, CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/ContextHook/AuthContext';

export default function Profile() {
    const theme = useColorScheme() ?? 'light';
    const AuthContext=useAuth();
    const [isauthenticated, setIsAuthenticated] = useState<Boolean>(AuthContext.isAuthenticated);
    const [message, setMessage] = useState("Profile");
    const [loading, setLoading] = useState(AuthContext.isLoading);

    if (loading) {
      return (<>
      <ParallaxScrollView 
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} 
        style={styles.reactLogo}/>}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text> Loading...</Text>
        <Text>Chargement...</Text>
      </ParallaxScrollView>
      </>)
    }
    else {
      return(
       
          <ParallaxScrollView
              headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
              headerImage={
                  <Image
                  source={require('@/assets/images/partial-react-logo.png')}
                  style={styles.reactLogo}
                  />
              }>
  
              <Collapsible title="Profile">
                  <ThemedView>
                      <Text>
                          {message}
                      </Text>
                  </ThemedView>
                
              </Collapsible>
              <Collapsible title="Reservation">
                  <Reservation/>
              </Collapsible>
              <Collapsible title="Settings">
                <Login></Login>
              </Collapsible>
          </ParallaxScrollView>
      
  );
    }
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
