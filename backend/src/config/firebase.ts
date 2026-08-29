import admin from 'firebase-admin';
import { env } from './index';
import logger from '../utils/logger';

let firebaseApp: admin.app.App;

export function initializeFirebase(): admin.app.App {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    logger.warn('Firebase credentials not configured. Firebase auth will be unavailable.');
    return null as any;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });

  logger.info('Firebase Admin SDK initialized');
  return firebaseApp;
}

export function getFirebaseApp(): admin.app.App {
  return firebaseApp;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }
  return firebaseApp.auth().verifyIdToken(idToken);
}
