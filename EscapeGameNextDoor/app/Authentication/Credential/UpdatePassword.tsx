import AppView from "@/components/ui/AppView";
import { UpdatePasswordDto } from "@/interfaces/User/UpdatePassword";
import { ServiceResponse } from "@/interfaces/ServiceResponse";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { useState } from "react";
import { Text, StyleSheet } from 'react-native';
import React from 'react';
import { Card, ActivityIndicator, TextInput, Button, Divider } from 'react-native-paper';
import { UnitofAction } from "@/action/UnitofAction";
import { useLocalSearchParams } from "expo-router";

export default function UpdatePasswordComponent() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [passwordData, setPasswordData] = useState<UpdatePasswordDto>({
        oldpassword: "",
        newpassword: "",
        email: email || ""
    });
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const Action = new UnitofAction();

    const handleInputChange = (field: keyof UpdatePasswordDto, value: string) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validatePasswordStrength = (password: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasUpperCase && hasNumber && hasSpecialChar;
    };

    const validatePasswords = (): boolean => {
        if (!passwordData.oldpassword) {
            setIsError(true);
            setError("Current password is required");
            return false;
        }

        if (passwordData.newpassword.length < 8) {
            setIsError(true);
            setError("Password must be at least 8 characters");
            return false;
        }

        if (!validatePasswordStrength(passwordData.newpassword)) {
            setIsError(true);
            setError("Password must contain an uppercase letter, number, and special character");
            return false;
        }

        if (passwordData.newpassword !== confirmPassword) {
            setIsError(true);
            setError("New password and confirmation don't match");
            return false;
        }

        return true;
    };

    const handleUpdatePassword = async () => {
        setIsError(false);
        setError("");
        
        if (!validatePasswords()) return;

        setLoading(true);
        try {
            const response = await Action.CredentialAction.UpdatePassword(passwordData) as ServiceResponse<GetUserDto>;
            if (!response.Success) {
                setIsError(true);
                setError(response.Message || "Failed to update password");
            } else {
                // Handle successful password update
                setError("Password updated successfully!");
                // Clear form
                setPasswordData({
                    oldpassword: "",
                    newpassword: "",
                    email: email || ""
                });
                setConfirmPassword("");
            }
        } catch (error) {
            setIsError(true);
            setError("An unexpected error occurred");
            console.error("Password update error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <AppView>
                <Card style={styles.card}>
                    <Card.Title title="Updating Password..." />
                    <Card.Content>
                        <ActivityIndicator size="large" />
                    </Card.Content>
                </Card>
            </AppView>
        );
    }

    return (
        <AppView>
            <Card style={styles.card}>
                <Card.Title 
                    title="Update Password" 
                    titleStyle={styles.cardTitle}
                />
                <Divider className="mb-4" />
                <Card.Content>
                    <Text style={styles.instruction}>
                        Password must be at least 8 characters long and contain:
                    </Text>
                    <Text style={styles.instruction}>
                        • An uppercase letter</Text>
                    <Text style={styles.instruction}>
                        • A number</Text>
                    <Text style={styles.instruction}>
                        • A special character</Text>
                </Card.Content>
                <Card.Content>
                    {error ? (
                        <Text style={[
                            styles.errorText, 
                            !isError && styles.successText
                        ]}>
                            {error}
                        </Text>
                    ) : null}
                    
                    <TextInput
                        style={styles.input}
                        label="Current Password"
                        secureTextEntry={true}
                        value={passwordData.oldpassword}
                        onChangeText={(text) => handleInputChange('oldpassword', text)}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    
                    <TextInput
                        style={styles.input}
                        label="New Password"
                        secureTextEntry={true}
                        value={passwordData.newpassword}
                        onChangeText={(text) => handleInputChange('newpassword', text)}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    
                    <TextInput
                        style={styles.input}
                        label="Confirm New Password"
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        onPress={handleUpdatePassword}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        Update Password
                    </Button>
                </Card.Content>
            </Card>
        </AppView>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 16,
        padding: 8,
        borderRadius: 8,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
        backgroundColor: '#050505',
    },
    buttonLabel: {
        color: 'white',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
    successText: {
        color: 'green',
    },
    instruction: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
});