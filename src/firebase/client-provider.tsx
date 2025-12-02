"use client";

import { createContext, useContext, ReactNode } from "react";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// Initialize Firebase outside of the component to ensure it's only done once.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // The value is now static and doesn't need to be in a state.
  const value = { app, auth };

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
