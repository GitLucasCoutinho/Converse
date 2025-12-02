// Este arquivo centraliza a inicialização do Firebase.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

// Garante que a inicialização ocorra apenas uma vez.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);

export { app, auth };
