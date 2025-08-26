// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvOhI3UwvaQQnsBwEyWRZCrdLogDbSVOY",
  authDomain: "dealhub-b48fa.firebaseapp.com",
  projectId: "dealhub-b48fa",
  storageBucket: "dealhub-b48fa.firebasestorage.app",
  messagingSenderId: "968288379785",
  appId: "1:968288379785:web:4b70f4fbe04a5c2c257758"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);