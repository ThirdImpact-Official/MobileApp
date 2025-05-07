import ParallaxScrollView from "@/components/ParallaxScrollView";
import { RegisterDto } from "@/interfaces/Credentials/RegisterDto";
import { Text,Image,StyleSheet, useColorScheme } from "react-native";
import { Box, TextField,InputAdornment,IconButton,Button, Typography,InputLabel  } from "@mui/material";
import FormUtils from "@/classes/FormUtils";
import { useState } from "react";
import { Visibility,VisibilityOff } from "@mui/icons-material";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from '../../constants/Colors';
import { ThemedText } from "@/components/ThemedText";
export default function Register() {
//-----------States-----------------------------------------------------
    const [register,setregister]=useState<RegisterDto | undefined>(undefined);
    const color=useColorScheme();
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
    }
//-----------Handlers-----------------------------------------------------
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    };
    const handleRegisterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      FormUtils.handleInputChange(event,setregister,register);
    };

    return (
       <ParallaxScrollView 
                 headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
                 headerImage={
                     <Image
                     source={require('@/assets/images/partial-react-logo.png')}
                     style={styles.reactLogo}
                     />
                 }
                 >
                <Box className="text-center items-center justify-evenly flex flex-col space-y-4">
                    <ThemedText>
                        <Typography variant="h4" className="text-center items-center justify-evenly flex flex-col">
                            <ThemedView   >
                                <ThemedText >
                                <Text className="text-3xl">S'enregistrer</Text>
                                </ThemedText>
                            </ThemedView>
                        </Typography>
                    </ThemedText>
                 <ThemedView className="space-y-4">
                    <ThemedText>
                    <Box className="flex flex-row justify-between  space-x-4">
                        <ThemedText>
                            <InputLabel>
                                <Text className="text-lg text-light">
                                    UserName
                                </Text>
                            </InputLabel>
                        </ThemedText>
                        <TextField 
                            className="text-light bg-white"
                            name={"UserName"}
                            value={register?.userName}
                            onChange={handleRegisterChange}
                            placeholder={
                                "UserName"} />
                    </Box>
                    </ThemedText>
                        <Box  className="flex flex-row justify-between  space-x-4">
                        <ThemedText>
                            <InputLabel>
                                <Text className="text-lg text-light">
                                    Email Adress
                                </Text>
                            </InputLabel>
                        </ThemedText>
                        <TextField 
                            className="text-light bg-white"
                            name="email"
                            value={register?.emailAdress}
                            onChange={handleRegisterChange}
                            placeholder="email Address" />
                        </Box>
                        <Box  className="flex flex-row justify-between  space-x-4">
                            <ThemedText>
                                <InputLabel>
                                    <Text className="text-lg text-light">
                                        First Name 
                                    </Text>
                                </InputLabel>
                            </ThemedText>
                            <TextField 
                                className="text-light bg-white"
                                name="email"
                                value={register?.firstName}
                                onChange={handleRegisterChange}
                                placeholder="firstName" />
                        </Box>
                        <Box  className="flex flex-row justify-between  space-x-4">

                           <ThemedText>
                            <InputLabel>
                                <Text className="text-lg text-light">
                                    Last Name
                                </Text>
                            </InputLabel>
                        </ThemedText>
                        <TextField
                            className="text-light bg-white"
                            name="FirstName"
                            value={register?.lastName}
                            onChange={handleRegisterChange}
                            placeholder="LastName" />
                        </Box>
                        <Box  className="flex flex-row justify-between  space-x-4">
                            <ThemedText>
                                <InputLabel>
                                    <Text className="text-lg text-light">
                                        Password
                                    </Text>
                                </InputLabel>
                            </ThemedText>
                            <TextField 
                                className="text-light bg-white"
                                name="password"
                                value={register?.password}
                                type={ showPassword ? "text" : "password" }
                                InputProps={{
                                    endAdornment:(
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                }
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                onMouseUp={handleMouseUpPassword}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff />  : <Visibility/>}
                                            </IconButton>
                                    </InputAdornment>)
                                }}
                                onChange={handleRegisterChange}
                                placeholder="password" />
                        </Box>
                    </ThemedView>
                    <Box className="text-center items-center justify-evenly flex flex-row">
                        <Button variant="contained"
                        >S'inscrire </Button>
                    </Box>
                </Box>
             </ParallaxScrollView>
    );
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