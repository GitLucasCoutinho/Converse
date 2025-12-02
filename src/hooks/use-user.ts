"use client";

import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/firebase'; // Importar a instância de auth do arquivo central

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Firebase Login Error:", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Firebase Logout Error:", error);
    }
  }, []);


  return { user, isLoading, login, logout };
}
