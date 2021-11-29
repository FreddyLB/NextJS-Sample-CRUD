import firebase, { initializeApp } from "firebase/app";
import firebaseAnalytics from "firebase/analytics";
import { Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: firebase.FirebaseApp | undefined;
let analytics: Analytics | undefined;

if (app == null && analytics == null) {
  app = initializeApp(firebaseConfig);
  console.log("Initialized!");
}

export function getFirebaseApp() {
  return app;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  const isSupported = await firebaseAnalytics.isSupported();
  
  if (isSupported) {
    if (analytics == null) {
      analytics = firebaseAnalytics.getAnalytics(app);
    }

    return analytics;
  }

  return null;
}
