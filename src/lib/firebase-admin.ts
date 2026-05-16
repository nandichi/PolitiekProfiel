import "server-only";

import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cached: { app: App; db: Firestore } | null = null;

function loadServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !rawKey) {
    return null;
  }
  return {
    projectId,
    clientEmail,
    privateKey: rawKey.replace(/\\n/g, "\n"),
  } as const;
}

export function firebaseAdmin() {
  if (cached) return cached;

  let app: App;
  if (getApps().length > 0) {
    app = getApp();
  } else {
    const sa = loadServiceAccount();
    if (sa) {
      app = initializeApp({
        credential: cert({
          projectId: sa.projectId,
          clientEmail: sa.clientEmail,
          privateKey: sa.privateKey,
        }),
        projectId: sa.projectId,
      });
    } else {
      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "politiekprofiel-app",
      });
    }
  }

  const db = getFirestore(app);
  cached = { app, db };
  return cached;
}

export function firestore() {
  return firebaseAdmin().db;
}
