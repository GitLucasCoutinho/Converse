"use client";

import { createContext, useContext, ReactNode } from "react";
import { app, auth } from "@/firebase";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
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
