"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useFirebase } from '@/firebase/client-provider';

export function useUser() {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Auth service might not be available on initial render.
      // The provider will re-render when it is.
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return { user, isLoading };
}
