import { Platform } from 'react-native';
import * as SecureStore from "expo-secure-store";

export class SecureStoreApp {
  /**
   * Save a value to secure storage
   * @param key The key to store the value under
   * @param value The value to store (will be JSON stringified if object/array)
   */
  public async save(key: string, value: any): Promise<void> {
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(key, valueToStore);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    } else {
      try {
        // Use the correct function name (either setItem or setItemAsync)
        await SecureStore.setItemAsync(key, valueToStore);
      } catch (error) {
        console.error("Error saving to SecureStore:", error);
      }
    }
  }
  
  /**
   * Retrieve a value from secure storage
   * @param key The key to retrieve
   * @param showAlert Whether to show an alert on native platforms (default: false)
   * @returns The stored value, or null if not found
   */
  public async getValueFor(key: string, showAlert: boolean = false): Promise<any> {
    let result = null;
    
    if (Platform.OS === "web") {
      try {
        result = localStorage.getItem(key);
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    } else {
      try {
        // Use the correct function name (either getItem or getItemAsync)
        result = await SecureStore.getItemAsync(key);
        
        if (showAlert) {
          if (result) {
            alert("🔐 Here's your value 🔐 \n" + result);
          } else {
            alert('No values stored under that key.');
          }
        }
      } catch (error) {
        console.error("Error reading from SecureStore:", error);
      }
    }
    
    // Try to parse JSON if the result looks like JSON
    if (result && (result.startsWith('{') || result.startsWith('['))) {
      try {
        return JSON.parse(result);
      } catch (e) {
        return result;
      }
    }
    
    return result;
  }

  /**
   * Remove a value from secure storage
   * @param key The key to remove
   */
  public async removeValueFrom(key: string): Promise<void> {
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from localStorage:", error);
      }
    } else {
      try {
        // Use the correct function name (either deleteItem or deleteItemAsync)
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error("Error removing from SecureStore:", error);
      }
    }
  }
  
  // ... rest of your class remains the same
}