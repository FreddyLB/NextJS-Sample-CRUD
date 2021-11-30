import firebaseAdmin, { initializeApp } from "firebase-admin/app";
import serviceAccount from "private/firebase-secret.json";

let app: firebaseAdmin.App | undefined;

if (app == null) {
  app = initializeApp({
    credential: firebaseAdmin.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });
}

export function getFirebaseAdmin() {
  return app;
}
