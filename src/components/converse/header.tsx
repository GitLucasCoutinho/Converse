"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon, ConverseIcon } from "@/components/converse/icons";
import { BotMessageSquare, LogOut } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ClientOnly } from "../client-only";
import { useFirebase } from "@/firebase/client-provider";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useUser } from "@/hooks/use-user";
import { Loader } from "lucide-react";

type HeaderProps = {
  onSummarize: () => void;
  onLogin: () => void;
  onLogout: () => void;
};

export function Header({ onSummarize, onLogin, onLogout }: Omit<HeaderProps, 'isLoggedIn'>) {
    const { auth } = useFirebase();
    const { user, isLoading } = useUser();

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            onLogin();
        } catch (error) {
            console.error("Error signing in with Google", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            onLogout();
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

  return (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ConverseIcon className="h-8 w-8 text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Converse</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onSummarize}>
          <BotMessageSquare className="mr-2 h-4 w-4" />
          Summarize
        </Button>
        <ClientOnly>
          <ThemeSwitcher />
        </ClientOnly>
        {isLoading ? (
            <Button variant="outline" size="icon" disabled>
                <Loader className="h-5 w-5 animate-spin" />
            </Button>
        ) : user ? (
          <Button variant="outline" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" onClick={handleLogin}>
            <GoogleIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
