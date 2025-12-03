"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { app, auth } from "@/firebase"; // Import singleton instances
import type { FirebaseApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
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
