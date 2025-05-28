import { useState } from "react";

/**
 * Custom hook for managing localStorage with proper error handling and SSR support
 * @param key - The localStorage key
 * @param initialValue - The initial value to use if nothing is stored
 * @returns [storedValue, setValue] - Current value and setter function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        return initialValue;
      }

      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Handle specific localStorage errors
      if (error instanceof Error) {
        if (error.name === "QuotaExceededError") {
          console.warn(
            `localStorage quota exceeded for key "${key}". Consider clearing old data.`
          );
        } else if (error.message.includes("localStorage is not available")) {
          console.warn(
            `localStorage is not available (private browsing mode?)`
          );
        } else {
          console.warn(
            `Error setting localStorage key "${key}":`,
            error.message
          );
        }
      } else {
        console.warn(`Unknown error setting localStorage key "${key}":`, error);
      }
    }
  };

  return [storedValue, setValue];
}
