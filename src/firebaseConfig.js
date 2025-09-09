import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "test-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "test-domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "test-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "test-bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "test-sender",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "test-app",
};

// ✅ Prevent Firebase from throwing invalid key errors during tests
let app, auth, db;

if (process.env.NODE_ENV === "test") {
  // Fake objects for Jest
  app = {};
  auth = {};
  db = {};
} else {
  // Real Firebase init for dev/prod
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
