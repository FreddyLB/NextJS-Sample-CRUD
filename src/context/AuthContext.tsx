import React, { useState } from "react";
import { getFirebaseApp } from "src/firebase/firebaseClient";
import { createContext } from "react";
import * as firebaseAuth from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import nookies from "nookies";
import { isServer, isBrowser } from "@shared/utils";

export type FirebaseUser = firebaseAuth.User;

export interface AuthContextProps {
  user: FirebaseUser | null;
  token: string | null;
  loginWithGoogle: () => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // To prevent NextJS to run client-side firebase on the server
  if (isServer()) {
    return (
      <AuthContext.Provider value={{} as any}>{children}</AuthContext.Provider>
    );
  }

  const googleProvider = new GoogleAuthProvider();
  const app = getFirebaseApp();
  const auth = firebaseAuth.getAuth(app);

  firebaseAuth.getRedirectResult(auth).then((credentials) => {
    if (credentials) {
      const user = credentials.user;
      setUser(user);
    }
  });

  auth.onAuthStateChanged((user) => {
    setUser(user);
    setIsLoading(false);
  });

  auth.onIdTokenChanged(async (user) => {
    if (isBrowser()) {
      if (user) {
        const token = await user.getIdToken();        
        nookies.set(null, "token", token);
        setToken(token);
      } else {
        nookies.set(null, "token", "");
        setToken(null);
      }
    }
  });

  const loginWithGoogle = () => {
    const loginAsync = async () => {
      try {
        await firebaseAuth.signInWithRedirect(auth, googleProvider);
      } finally {
      }
    };

    loginAsync();
  };

  const logout = async () => {
    try {
      await firebaseAuth.signOut(auth);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
