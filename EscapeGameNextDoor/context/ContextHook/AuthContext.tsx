import React, { createContext, useContext, useEffect, useState, FC } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";

import { AuthResponse } from "@/interfaces/User/Authresponse";
import { LoginCredentials } from "@/interfaces/login/loginCredentials";
import { UnitofAction } from "@/action/UnitofAction";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { SecureStoreApp } from "@/classes/SecureStore";
import { RegisterDto } from "@/interfaces/Credentials/RegisterDto";
import { useRouter } from 'expo-router';
import { ServiceResponse } from "@/interfaces/ServiceResponse";

// Constants
const AUTH_TOKEN_KEY = "Token";
const AUTH_STATUS_KEY = "isAuthenticated";

// Types
interface AuthContextType {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterDto) => Promise<ServiceResponse<GetUserDto>>;
  user: GetUserDto;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const router  = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<GetUserDto>({
    username: "",
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
    phoneNumber: "",
    emailVerified: false,
    reportCount: 0,
    roleId: 0,
    lastLogin: "",
  });

  const action = new UnitofAction();
  const secure = new SecureStoreApp();

  const getStorageItem = async (key: string): Promise<string | null> => {
    return await secure.getValueFor(key);
  };

  const setStorageItem = async (key: string, value: string) => {
    await secure.save(key, value);
  };

  const deleteStorageItem = async (key: string) => {
    await secure.removeValueFrom(key);
  };

  const getUserInformation = async (token?: string) => {
    const currentToken = token || (await getStorageItem(AUTH_TOKEN_KEY));
    if (currentToken) {
      try {
        const decoded = jwtDecode<GetUserDto>(currentToken);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        await removeAuth();
      }
    }
  };

  const removeAuth = async () => {
    await deleteStorageItem(AUTH_TOKEN_KEY);
    await deleteStorageItem(AUTH_STATUS_KEY);
    setIsAuthenticated(false);
    setUser({
      username: "",
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      picture: "",
      phoneNumber: "",
      emailVerified: false,
      reportCount: 0,
      roleId: 0,
      lastLogin: "",
    });
    delete axios.defaults.headers.common["Authorization"];
  };

  const loadAuthState = async () => {
    try {
      const authStatus = await getStorageItem(AUTH_STATUS_KEY);
      const token = await getStorageItem(AUTH_TOKEN_KEY);
      if (authStatus === "true" && token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await getUserInformation(token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthState();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await action.CredentialAction.Login(credentials);
      if (response.Success && response.Data) {
        const authData = response.Data as AuthResponse;
        if (authData.token) {
          await setStorageItem(AUTH_TOKEN_KEY, authData.token);
          await setStorageItem(AUTH_STATUS_KEY, "true");

          axios.defaults.headers.common["Authorization"] = `Bearer ${authData.token}`;
          await getUserInformation(authData.token);
          setIsAuthenticated(true);
        } else {
          throw new Error("Token not found in response");
        }
      } else {
        throw new Error(response.Message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await action.CredentialAction.Logout();
      if (!response.Success) {
        console.warn("Logout failed:", response.Message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await removeAuth();
      setIsLoading(false);
    }
  };
  const register = async (data: RegisterDto): Promise<ServiceResponse<GetUserDto>> => {
    setIsLoading(true);
    try {
      const response = await action.CredentialAction.Register(data);
      if (response.Success) {
        console.log("Registration successful:", response.Message);
        // Optionally, you can auto-login after registration
        //resumer la connexion
        router.push("/Authentication/PostRegister");
      }
      return response as ServiceResponse<GetUserDto>;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  // Auto-logout on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.warn("Token expired or unauthorized. Logging out.");
          await removeAuth();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await action.CredentialAction.Checkauth();
      if (authStatus.Success && authStatus.Data) {
        const token = await getStorageItem(AUTH_TOKEN_KEY);
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          await getUserInformation(token);
          setIsAuthenticated(true);
        } else {
          await removeAuth();
        }
      } else {
        await removeAuth();
      }
    };
    checkAuthStatus();
  }, []);
  const value: AuthContextType = {
    login,
    logout,
    register,
    user,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
