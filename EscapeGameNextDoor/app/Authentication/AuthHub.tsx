
import { styles } from '../../constants/styles';
import { Image, Text, useColorScheme} from "react-native";
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { Box, Button, Typography } from '@mui/material';
import { Redirect, router } from 'expo-router'; 
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';


export default function AuthHub()
{
    const color =useColorScheme();
    const theme = useColorScheme() ?? 'light';


    return(
        <ParallaxScrollView 
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={ <Image source={
                require('@/assets/images/partial-react-logo.png')}
                style={styles.headerImage}
              />}>
            <Box className="text-center items-center justify-evenly flex flex-row space-x-4 ">
                 <ThemedText>
                    <Text className="text-3xl text-center items-center justify-evenly flex flex-col  ">Authentification</Text>
                 </ThemedText>
                <ThemedView>
                    <Box className="bg-white text-center items-center justify-evenly flex flex-row">
                        <Button variant='contained'
                            onClick={()=>{ router.push("/Authentication/Login")}}
                            className='m-1 p-1 '>
                            <Text>Se connecter</Text>
                        </Button>
                        <Button
                        onClick={()=>{router.push("/Authentication/Register")}}
                            className='m-1 p-1 ' 
                            variant="contained">
                            <Text>s'inscrire</Text>
                        </Button>
                    </Box>
                </ThemedView>
            </Box>
        </ParallaxScrollView>)
}