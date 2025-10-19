'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isConfigAvailable = firebaseConfig && firebaseConfig.projectId;
  const isRunningInEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true';

  // In the Firebase Studio development environment, the initializeApp()
  // function is patched to automatically configure the app with the currently
  // selected project.
  const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  if (isRunningInEmulators) {
    // These environment variables are set by the Firebase CLI when running in an emulated environment.
    // They are used to connect the Firebase SDKs to the local emulators.
    const firestoreHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    const authHost = process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST || 'http://127.0.0.1:9099';
    
    // It's important to check if the emulators are already connected
    // before attempting to connect again.
    if (!(firestore as any)._settings.host.includes('localhost')) {
      console.log(`Connecting to Firestore emulator at ${firestoreHost}`);
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    }
    
    if (!auth.config.emulator) {
      console.log(`Connecting to Auth emulator at ${authHost}`);
      connectAuthEmulator(auth, authHost, { disableCors: true });
    }
  }

  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';