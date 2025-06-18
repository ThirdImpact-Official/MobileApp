import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { Card, TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { useAuth } from '../../context/ContextHook/AuthContext';
import { LoginCredentials } from "@/interfaces/Credentials/loginDto";
import AppView from "@/components/ui/AppView";
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from "@/components/ThemedText";

export default function LoginScreen() {
  const router = useRouter();
  const authContext = useAuth();
  
  // State management
  const [credentials, setCredentials] = useState<LoginCredentials>({
    emailAdress: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const isAuthenticated = authContext.isAuthenticated;

  /**
   * Handle input field changes
   */
  const handleInputChange = useCallback((key: keyof LoginCredentials, value: string) => {
    setCredentials((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    
    // Clear validation errors when user starts typing
    if (validationErrors[key === 'emailAdress' ? 'email' : key]) {
      setValidationErrors(prev => ({
        ...prev,
        [key === 'emailAdress' ? 'email' : key]: undefined
      }));
    }
    
    // Clear general error when user makes changes
    if (error) {
      setError("");
    }
  }, [validationErrors, error]);

  /**
   * Validate form inputs
   */
  const validateForm = useCallback((): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    // Email validation
    if (!credentials.emailAdress.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.emailAdress)) {
      errors.email = "Format d'email invalide";
    }
    
    // Password validation
    if (!credentials.password) {
      errors.password = "Le mot de passe est requis";
    } else if (credentials.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [credentials]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      await authContext.login(credentials);
      
      if (authContext.isAuthenticated) {
        navigateToHome();
      }
    } catch (error) {
      console.error("Failed to login:", error);
      
      // Handle different types of errors
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [credentials, validateForm, authContext]);

  /**
   * Navigate to home screen
   */
  const navigateToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError("");
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigateToHome();
    }
  }, [isAuthenticated, navigateToHome]);

  // Loading state
  if (isLoading) {
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
        <Card style={styles.loadingCard}>
          <Card.Title title="Authentification" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <ThemedText style={styles.loadingText}>Connexion en cours...</ThemedText>
            </View>
          </Card.Content>
        </Card>
      </ParallaxScrollView>
    );
  }

  // Error state (standalone error screen)
  if (error && !credentials.emailAdress && !credentials.password) {
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
        <Card style={styles.errorCard}>
          <Card.Title title="Erreur d'authentification" titleStyle={styles.cardTitle} />
          <Card.Content>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <Button mode="contained" onPress={clearError} style={styles.retryButton}>
              Réessayer
            </Button>
          </Card.Content>
        </Card>
      </ParallaxScrollView>
    );
  }

  // Main login form
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
      <ThemedView style={styles.container}>
        <Card style={styles.form}>
          <Card.Title title="Connexion" titleStyle={styles.title} />
          <Card.Content>
            {/* General error message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessageText}>{error}</Text>
              </View>
            )}

            {/* Email input */}
            <TextInput
              label="Adresse email"
              mode="outlined"
              value={credentials.emailAdress}
              onChangeText={(text) => handleInputChange("emailAdress", text)}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              error={!!validationErrors.email}
              disabled={isLoading}
            />
            {validationErrors.email && (
              <Text style={styles.validationError}>{validationErrors.email}</Text>
            )}

            {/* Password input */}
            <TextInput
              label="Mot de passe"
              mode="outlined"
              value={credentials.password}
              onChangeText={(text) => handleInputChange("password", text)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={styles.input}
              error={!!validationErrors.password}
              disabled={isLoading}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={togglePasswordVisibility}
                  disabled={isLoading}
                />
              }
            />
            {validationErrors.password && (
              <Text style={styles.validationError}>{validationErrors.password}</Text>
            )}

            {/* Login button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              disabled={isLoading || !credentials.emailAdress || !credentials.password}
              loading={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>

            {/* Register link */}
            <View style={styles.linkContainer}>
              <Link href="/Authentication/Register" asChild>
                <Button mode="text" disabled={isLoading}>
                  Vous n'avez pas encore de compte ? Inscrivez-vous
                </Button>
              </Link>
            </View>

            {/* Forgot password link (if needed) */}
            <View style={styles.linkContainer}>
              <Button mode="text" disabled={isLoading} onPress={() => {
                // Add forgot password functionality here
                console.log("Forgot password pressed");
              }}>
                Mot de passe oublié ?
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ThemedView>
       </ParallaxScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    width: "100%",
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorMessageText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  validationError: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 12,
  },
  loadingCard: {
    margin: 16,
    elevation: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorCard: {
    margin: 16,
    elevation: 4,
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});