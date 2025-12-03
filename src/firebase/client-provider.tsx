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
    // This is the ideal way to handle redirect results.
    // It actively checks for a redirect result when the app loads.
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User successfully signed in.
          setUser(result.user);
        }
        // Even if result is null, we set loading to false.
        // It just means the page was loaded without a redirect.
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      })
      .finally(() => {
         // Now, set up the normal auth state listener for any future changes
         // (like logging out or token refresh).
         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
         });
         
         // In a real app, you'd return unsubscribe to clean up.
         // For this scenario, we'll keep it simple as the provider is at the root.
      });

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
