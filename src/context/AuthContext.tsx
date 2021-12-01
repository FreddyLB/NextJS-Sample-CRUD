import React from "react";
import { getFirebaseApp } from "src/firebase/firebaseClient";
import { createContext } from "react";
import * as firebaseAuth from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import nookies from "nookies";
import { isServer, isBrowser } from "@shared/utils";
import { useLocalStorageItem } from "src/hooks/useStorageItem";

export type FirebaseUser = firebaseAuth.User;

export interface AuthContextProps {
  user: FirebaseUser | null;
  loginWithGoogle: () => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const isRedirecting = useLocalStorageItem("is-firebase-redirecting", false);
  const [isLoading, setIsLoading] = React.useState(!!isRedirecting.value);

  // To prevent NextJS to run client-side firebase on the server
  if (isServer()) {
    return <AuthContext.Provider value={{} as any}>{children}</AuthContext.Provider>;
  }

  const googleProvider = new GoogleAuthProvider();
  const app = getFirebaseApp();
  const auth = firebaseAuth.getAuth(app);

  auth.onAuthStateChanged((user) => setUser(user));

  auth.onIdTokenChanged(async (user) => {
    if (isBrowser()) {
      if (user) {
        const token = await user.getIdToken();
        nookies.set(null, "token", token);
      } else {
        nookies.set(null, "token", "");
      }
    }
  });

  firebaseAuth.getRedirectResult(auth).then((credentials) => {
    if (credentials) {
      setUser(credentials.user);
    }

    if (isLoading) {
      setIsLoading(false);
    }
  });

  const loginWithGoogle = () => {
    setIsLoading(true);
    isRedirecting.set(true);

    const loginAsync = async () => {
      await firebaseAuth.signInWithRedirect(auth, googleProvider);
      try {
        await firebaseAuth.signInWithRedirect(auth, googleProvider);
        const credentials = await firebaseAuth.getRedirectResult(auth);

        if (credentials) {
          const user = credentials.user;
          setUser(user);
        }
      } finally {
        setIsLoading(false);
        isRedirecting.remove();
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
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
