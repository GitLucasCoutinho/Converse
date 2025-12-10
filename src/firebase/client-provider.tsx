"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { app, auth } from "@/firebase"; // Import singleton instances
import type { FirebaseApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  user: User | null;
  isLoading: boolean;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function will be executed once when the component mounts.
    const processAuth = async () => {
      try {
        // First, actively check for a redirect result.
        // This is crucial for capturing the user after they return from Google's login page.
        const result = await getRedirectResult(auth);
        if (result) {
          // If there's a result, the user is now logged in.
          // Set the user and we can stop loading.
          setUser(result.user);
        }
      } catch (error) {
        // Handle potential errors from getRedirectResult, e.g., credential already in use.
        console.error("Error processing redirect result:", error);
      } finally {
        // After checking for a redirect, set up the normal auth state listener.
        // This will handle all other auth changes, like manual sign-ins, sign-outs,
        // and keeping the session alive.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          // Only set loading to false here, ensuring we have a definitive auth state.
          setIsLoading(false);
        });

        // In a real app, you'd want to return this unsubscribe function
        // to clean up the listener when the provider unmounts.
        // For this context, it's okay to omit for simplicity as it lives at the root.
      }
    };

    processAuth();
    
    // The empty dependency array ensures this effect runs only once on mount.
  }, []);

  const value = { app, auth, user, isLoading };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
