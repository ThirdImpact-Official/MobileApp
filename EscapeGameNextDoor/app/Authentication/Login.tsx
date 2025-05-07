import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Text, Image, StyleSheet, } from "react-native";
import { Box, TextField, Typography, Button, InputAdornment, IconButton, Stack as MUIStack, Input, InputLabel } from "@mui/material";
import { LoginCredentials } from "@/interfaces/Credentials/loginDto";
import { useState } from "react";
import { useAuth, AuthContext } from '../../context/ContextHook/AuthContext';
import { Redirect, Stack, useRouter } from "expo-router";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function LoginScreen() {
  const Route = useRouter();
  const AuthContext = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    emailAdress: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = AuthContext.isAuthenticated;
  const handleEmailChange = (email: string) => {
    setCredentials((prev) => ({ ...prev, email }));
  };

  const handlePasswordChange = (password: string) => {
    setCredentials((prev) => ({ ...prev, password }));
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleOnChange = (key: keyof LoginCredentials, value: string) => {
    setCredentials((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {

      const responseAuth = await AuthContext.login(credentials);
      if (AuthContext.isAuthenticated) {
        // a retirer ai u seind e l'application

        automamated();
      }
      if (AuthContext.isAuthenticated) {
        automamated();
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };
  function automamated() {
    console.log("automated " + AuthContext.isAuthenticated);
    Route.push("/");
  }
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
      <Box className="items-center justify-center text-center flex flex-col">
        <ThemedText>
          <Typography variant="h4">
            <Text className="text-3xl">Login</Text>
          </Typography>
        </ThemedText>
        <ThemedView>
          <MUIStack spacing={2}
            sx={{ width: "100%" }}>
            <Box >
              <ThemedText>
                <Typography variant="h5">Connecte to The Application </Typography>
              </ThemedText>
            </Box>
            <Box className="flex flex-row justify-between  space-x-4">
              <ThemedText>
                <InputLabel>
                  <Text className="text-lg text-light">
                    Email
                  </Text>
                </InputLabel>
              </ThemedText>
              <TextField
                className="text-light bg-white border-2"
                name="email"
                value={credentials.emailAdress}
                onChange={(e) => handleOnChange("emailAdress", e.target.value)}
                label="email" />
            </Box>
            <Box className="flex flex-row justify-between space-x-4">
              <ThemedText>
                <InputLabel className="text-lg text-light">
                  <Text className="text-lg text-light">
                    Password
                  </Text>
                </InputLabel>
              </ThemedText>
              <TextField
                className="text-light bg-white"
                name="Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>)
                }}
                value={credentials.password}
                onChange={(e) => handleOnChange("password", e.target.value)}
                label="password" />
            </Box>
            <Box >
              <Button
                variant="contained"
                className="bg-black"
                onClick={handleSubmit} >Connecter</Button>
            </Box>

          </MUIStack>
        </ThemedView>
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