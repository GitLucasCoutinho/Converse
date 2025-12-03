"use client";

import { useCallback } from "react";
import { GoogleAuthProvider, signInWithRedirect, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/firebase";
import { useFirebase } from "@/firebase/client-provider";

export function useUser() {
  const { user, isLoading } = useFirebase();

  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  }, []);

  return { user, isLoading, login, logout };
}
