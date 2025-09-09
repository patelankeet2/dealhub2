import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "test-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "test-domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "test-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "test-bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "test-sender",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "test-app",
};

let app, auth, db, storage;

if (process.env.NODE_ENV === "test") {
  // Mock Firebase for Jest tests
  app = {};
  auth = {};
  db = {};
  storage = {};
} else {
  // Real Firebase init
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };
