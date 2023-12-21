"use client";

import { auth } from "@/lib/firebase/auth";
import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Typing for authentication context
interface AuthContextType {
  user: User | "loading" | null;
}

// Create the authentication context
export const AuthContext = createContext<AuthContextType>({
  user: null,
});

// Custom hook to access the authentication context
export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export default function AuthContextProvider({ children }: AuthContextProviderProps): JSX.Element {
  // Set up state to track the authenticated user and loading status
  const [user, setUser] = useState<User | "loading" | null>("loading");

  useEffect(() => {
    // Subscribe to the authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log(user);
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
        // TODO Figure out redirecting
      }
    });

    // Unsubscribe from the authentication state changes when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Provide the authentication context to child components
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
