import React, { useState } from "react";
import { View, Image, StyleSheet, useColorScheme } from "react-native";
import { TextInput, Text, Button, Card, HelperText } from "react-native-paper";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { RegisterDto } from "@/interfaces/Credentials/RegisterDto";
import FormUtils from "@/classes/FormUtils";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import { Eye, EyeOff } from "react-native-feather";
import { useAuth } from "@/context/ContextHook/AuthContext";
import { Redirect, router } from "expo-router";

export default function Register() {
    const [register, setRegister] = useState<RegisterDto>({
        userName: "",
        emailAdress: "",
        firstName: "",
        lastName: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const theme = useColorScheme() ?? 'light';
    const auth=useAuth()
    
    const handleRegisterChange = (name: keyof RegisterDto, value: string) => {
        setRegister(prev => ({
            ...prev,
            [name]: value,
        }));
    
    };

    const validateForm = () => {
        // Assuming FormUtils.ValidForm should be FormUtils.ValidateForm or similar, and returns { isValid, errors }
        // Assuming FormUtils.ValidForm should be FormUtils.ValidateForm or similar, and accepts (data, rules)
        const requiredFields: (keyof RegisterDto)[] = [
            "userName",
            "emailAdress",
            "firstName",
            "lastName",
            "password"
        ];
        const response = FormUtils.ValidForm(register, requiredFields);

        if (!response.isValid) {
            setIsError(true);
            setErrorMessage(response.errors.map(err => err.message).join(", "));
            return false;
        }
        setIsError(false);
        setErrorMessage("");
        return true;
    };
    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }
        const response = await useAuth().register(register);
        if (response.Success) {
            router.push("/Authentication/PostRegister");
        }
    };
    if(auth.isAuthenticated)
    {
        return(
            <Redirect href="/" />
        )
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
          { isError && (
            <ThemedView style={{ backgroundColor: theme === 'light' ? '#f8d7da' : '#721c24', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                <ThemedText style={{ color: theme === 'light' ? '#721c24' : '#f8d7da', fontSize: 16 }}>
                    {errorMessage}
                </ThemedText>   
            </ThemedView>
            )
          }
            <ThemedView style={styles.container}>
                <ThemedText>
                    <Text style={styles.title}>S'enregistrer</Text>
                </ThemedText>
                <Card style={{ marginBottom: 16, padding: 16 }}>
                    <Card.Content>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>UserName</Text>
                            <TextInput
                                style={styles.input}
                                value={register?.userName}
                                onChangeText={text => handleRegisterChange("userName", text)}
                                placeholder="UserName"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <ThemedText style={styles.label}>Email Address</ThemedText>
                            <TextInput
                                style={styles.input}
                                value={register?.emailAdress}
                                onChangeText={text => handleRegisterChange("emailAdress", text)}
                                placeholder="Email Address"
                                placeholderTextColor="#888"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={styles.input}
                                value={register?.firstName}
                                onChangeText={text => handleRegisterChange("firstName", text)}
                                placeholder="First Name"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                style={styles.input}
                                value={register?.lastName}
                                onChangeText={text => handleRegisterChange("lastName", text)}
                                placeholder="Last Name"
                                placeholderTextColor="#888"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordRow}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    value={register?.password}
                                    onChangeText={text => handleRegisterChange("password", text)}
                                    placeholder="Password"
                                    placeholderTextColor="#888"
                                    secureTextEntry={!showPassword}
                                />
                                <Button onPress={() => setShowPassword(s => !s)}>
                                    <ThemedText style={styles.showPassword}>
                                        {showPassword ? <EyeOff></EyeOff> : <Eye></Eye>}
                                    </ThemedText>
                                </Button>
                            </View>
                        </View>
                    </Card.Content>
                    <Card.Actions>
                        <View style={{flex:1}}>
                            <Button style={styles.button} onPress={handleRegister}>
                                <Text style={styles.buttonText}>S'inscrire</Text>
                            </Button>
                        </View>
                    </Card.Actions>
                </Card>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginVertical: 16,
        textAlign: "center",
    },
    inputGroup: {
        width: "100%",
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
       

    },
    input: {
 
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    passwordRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    showPassword: {
        fontSize: 20,
        marginLeft: 8,
    },
    button: {
        backgroundColor: "#222",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 24,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    reactLogo: {
        height: 178,
        width: 290,
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});
