import React from "react";
import { getFirebaseApp } from "src/firebase/firebaseClient";
import { createContext } from "react";
import * as firebaseAuth from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import nookies from "nookies";

export type FirebaseUser = firebaseAuth.User;

export interface AuthContextProps {
  user: FirebaseUser | null;
  loginWithGoogle: () => void;
  logout: () => void;
  isLoading: boolean;
}

const isBrowser = () => typeof window !== "undefined";

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const googleProvider = new GoogleAuthProvider();
  const app = getFirebaseApp();
  const auth = firebaseAuth.getAuth(app);

  auth.onAuthStateChanged((user) => setUser(user));

  auth.onIdTokenChanged(async (user) => {
    
    if (isBrowser()) {
      if (user) {
        const token = await user.getIdToken();
        nookies.set(null, "token", token)
      } else {
        nookies.set(null, "token", "")
      }
    }
  });

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await firebaseAuth.signInWithRedirect(auth, googleProvider);
      const credentials = await firebaseAuth.getRedirectResult(auth);

      if (credentials) {
        const user = credentials.user;
        setUser(user);
      }
    } finally {
      setIsLoading(false);
    }
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
