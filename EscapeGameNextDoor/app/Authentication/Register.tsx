import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, useColorScheme } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { RegisterDto } from "@/interfaces/Credentials/RegisterDto";
import FormUtils from "@/classes/FormUtils";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function Register() {
    const [register, setRegister] = useState<RegisterDto>({
        userName: "",
        emailAdress: "",
        firstName: "",
        lastName: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleRegisterChange = (name: keyof RegisterDto, value: string) => {
        setRegister(prev => ({
            ...prev,
            [name]: value,
        }));
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
            <View style={styles.container}>
                <ThemedText>
                    <Text style={styles.title}>S'enregistrer</Text>
                </ThemedText>
                <ThemedView>
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
                        <Text style={styles.label}>Email Address</Text>
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
                            <TouchableOpacity onPress={() => setShowPassword(s => !s)}>
                                <Text style={styles.showPassword}>
                                    {showPassword ? "🙈" : "👁️"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ThemedView>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>
            </View>
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
        color: "#333",
    },
    input: {
        backgroundColor: "#fff",
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
        backgroundColor: "#007bff",
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
