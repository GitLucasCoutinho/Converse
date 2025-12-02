"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { app, auth } from "@/firebase"; // Import singleton instances
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // The value is memoized to prevent unnecessary re-renders of consumers.
  // app and auth are stable singletons, so this only runs once.
  const value = useMemo(() => ({ app, auth }), []);

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
