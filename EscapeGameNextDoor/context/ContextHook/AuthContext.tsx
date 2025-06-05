import React, { createContext, useContext, useState, useEffect, FC } from "react";
import axios from "axios";
import { AuthResponse } from "@/interfaces/User/Authresponse";
import * as SecureStore from 'expo-secure-store';
import { LoginCredentials } from "@/interfaces/login/loginCredentials";
import { CreadentialAction } from "@/action/CreadentialAction";
import { UnitofAction } from '../../action/UnitofAction';
import { Platform } from "react-native";
import { GetUserDto } from "@/interfaces/User/GetUserDto";
import { SecureStoreApp } from "@/classes/SecureStore";
import { jwtDecode } from 'jwt-decode';

// Constants for SecureStore Keys 
const AUTH_TOKEN_KEY = "Token"; 
const AUTH_STATUS_KEY = "isAuthenticated";



interface AuthContextType {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  user:GetUserDto;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provides authentication state and functions to the application.
 *
 * The `AuthProvider` component is used to wrap the entire application in
 * order to provide authentication state and functions to the application.
 *
 * The component uses the `useState` hook to store the authentication state in
 * the component's state, and the `useEffect` hook to set up an interceptor for
 * axios to handle authentication.
 *
 * The `login` function is used to log in to the server, and the `logout`
 * function is used to log out of the server.
 *
 * The `isAuthenticated` state is used to determine whether the user is
 * authenticated or not.
 *
 * The component also provides a `checkAuth` function that can be used to
 * check the authentication state of the server.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  const [user,setUser] = useState<GetUserDto>({
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
  const action =new UnitofAction();
  const SecureAction=new SecureStoreApp();
  //storage methodes 
  const getStorageItem= async(key:string):Promise<string> =>{
    return await SecureAction.getValueFor(key);
  }

  const setStorageItem= async (key: string, value: string)=> {
    await SecureAction.save(key, value);
  }

  const deleteStorageItem=async(key: string)=>{
    await SecureAction.removeValueFrom(key);
  }
  //
  const getUserInformation = async () => {
    const userfromtoken = await getStorageItem(AUTH_TOKEN_KEY);
    const response = jwtDecode<GetUserDto>(userfromtoken);
    setUser(response);
  }
  const loadAuthState = async () => {
    try {
      const authStatus = await getStorageItem(AUTH_STATUS_KEY);
      setIsAuthenticated(authStatus === 'true');
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading auth state:", error);
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  };
  
  useEffect(() => {
    loadAuthState();
  }, []);

  /**
   * Logs in to the server with the given credentials.
   *
   * Updates the `isAuthenticated` state to `true` if the login is successful.
   *
   * Throws an error if the request to log in fails.
   * @param {LoginCredentials} credentials - The username and password to log in with.
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await action.CredentialAction.Login(credentials);
      console.log(" data from login :");
      console.log(response.Success);

      if (response.Success) {
        console.log('Data : ',response.Data);
        console.log('response message : '
          ,response.Message);
        // Store token if available
        if (response.Data) {
          const authResult = response.Data as AuthResponse;
          if (authResult.token) {
            await setStorageItem(AUTH_TOKEN_KEY, authResult.token);
            getUserInformation();
          }
        }
        await persistentAuthentication(true);
      } else {
        await persistentAuthentication(false);
        console.log('response message : '
        ,response.Message);
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw new Error("Login failed");
    }
  };

  /**
   * Logs out from the server and updates the authentication state.
   *
   * Throws an error if the logout request fails.
   *
   * @throws {Error} If the request to log out fails.
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await action.CredentialAction.Logout();
      
      if (!response.Success) {
        throw new Error('Logout failed');
      }
      
      // Remove authentication regardless of API response
      await removeAuth();
    } catch (error) {
      console.error("Logout error:", error);
      
      // Still clear authentication locally even if API fails
      await removeAuth();
      
      setIsLoading(false);
      throw new Error('Logout failed');
    }
  };

  /**
   * Checks the authentication state of the server.
   * If the request is successful, the `isAuthenticated` state is updated to true.
   * If the request fails, the `isAuthenticated` state is updated to false.
   */
  const checkAuth = async () => {
    if (isLoading) return; // Don't check if already loading
    
    try {
      const response = await action.CredentialAction
            .Checkauth();
          
      if (response.Success) {
        console.log("Check auth success:", response.Success);
        if (response.Success !== isAuthenticated) {
          await persistentAuthentication(response.Success);
        }
      } else {
        await removeAuth();
        
        // Don't call logout here to avoid potential infinite loop
        // Just clear the auth state locally
      }
    } catch (error) {
      console.error("Check auth failed:", error);
      await removeAuth();
    }
  };

  // Set axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Check authentication periodically
  useEffect(() => {
    // Only start interval after initial loading
    if (!isLoading) {
      const interval = setInterval(() => {
        checkAuth();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading, isAuthenticated]);

  // Set up axios interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await removeAuth(); // Just clear auth state without calling logout
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Authentication context value
  const value = {
    isAuthenticated,
    login,
    logout,
    user,
    isLoading, // Fixed casing for consistency
  };

  // Helper function to persist authentication state
  async function persistentAuthentication(valueToStore: boolean) {
    try {
      await setStorageItem(AUTH_STATUS_KEY, valueToStore.toString());
      setIsAuthenticated(valueToStore);
      setIsLoading(false);
      console.log("Auth state persisted:", valueToStore);
    } catch (error) {
      console.error("Error persisting auth state:", error);
      setIsLoading(false);
    }
  }

  // Helper function to remove authentication
  async function removeAuth() {
    try {
      await deleteStorageItem(AUTH_STATUS_KEY);
      await deleteStorageItem(AUTH_TOKEN_KEY);
      setIsAuthenticated(false);
      setIsLoading(false);
      console.log("Auth state removed");
    } catch (error) {
      console.error("Error removing auth state:", error);
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 *
 * This hook provides access to the authentication context, allowing components
 * to use authentication-related state and functions. It must be used within a
 * component wrapped by `AuthProvider`.
 *
 * @throws {Error} If the hook is used outside of an `AuthProvider`.
 *
 * @returns {AuthContextType} The authentication context value.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};