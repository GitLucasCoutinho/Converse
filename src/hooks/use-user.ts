"use client";

import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useFirebase } from '@/firebase/client-provider';

export function useUser() {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = useCallback(async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, [auth]);

  const logout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
  }, [auth]);


  return { user, isLoading, login, logout };
}
