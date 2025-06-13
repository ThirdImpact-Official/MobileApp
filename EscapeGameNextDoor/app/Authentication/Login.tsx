import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from '../../context/ContextHook/AuthContext';
import { useRouter } from "expo-router";
import { LoginCredentials } from "@/interfaces/Credentials/loginDto";
import AppView from "@/components/ui/AppView";
import React from "react";

export default function LoginScreen() {
  const Route = useRouter();
  const AuthContext = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    emailAdress: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = AuthContext.isAuthenticated;

  const handleOnChange = (key: keyof LoginCredentials, value: string) => {
    setCredentials((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await AuthContext.login(credentials);
      if (AuthContext.isAuthenticated) {
        automamated();
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  function automamated() {
    Route.push("/");
  }

  useEffect(() => {
    if (isAuthenticated) {
      automamated();
    }
  }, [isAuthenticated]);

  return (
    <AppView>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={credentials.emailAdress}
            onChangeText={(text) => handleOnChange("emailAdress", text)}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              value={credentials.password}
              onChangeText={(text) => handleOnChange("password", text)}
              placeholder="Password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword((show) => !show)}>
              <Text style={styles.showPassword}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 24,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#222",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  showPassword: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
