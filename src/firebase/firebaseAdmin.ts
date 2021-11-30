import firebaseAdmin, { initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "private/firebase-secret.json";

let app: firebaseAdmin.App | undefined;

if (app == null) {
  app = initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });

  console.log("Initialized server side firebase");
}

export function getFirebaseAdmin() {
  return app;
}
