import ParallaxScrollView from "@/components/ParallaxScrollView";
import { AuthProvider, useAuth } from "@/context/ContextHook/AuthContext";
import { Text, View,StyleSheet,Image,ActivityIndicator } from "react-native";
import { useState } from "react";
import { Redirect } from "expo-router";

function Activities()
{
    const [isLoading, setLoading] = useState(true);
    const Auth=useAuth();
    const [isauthenticated, setIsAuthenticated] = useState(Auth.isAuthenticated);
    
    
    if(isLoading)
        {
            return(
                <AuthProvider>
                <ParallaxScrollView 
                    headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                    headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo}/>}>
                        <ActivityIndicator />
                        <Text>Loading...</Text>
                </ParallaxScrollView>

                </AuthProvider>
            )
        }
    else{

        if(isauthenticated)
        {
            return <Redirect href="../Authentication/AuthHub" />;
        }
        else{
            
            return(   
            <ParallaxScrollView 
                    headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                    headerImage={<Image source={require('@/assets/images/partial-react-logo.png')} style={styles.reactLogo}/>}>
                <View>
                    <Text>Activities</Text>
                </View>
            </ParallaxScrollView>
            )
        }
    }
}
const styles = StyleSheet.create({
    reactLogo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    }
})

export default Activities;