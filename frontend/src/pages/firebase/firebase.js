// src/firebase.js

// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Timestamp, FieldValue } from "firebase/firestore"; // For Firestore operations
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcRlNcadKaM2o45tj5Tc0bGFXSDU_BoPc",
  authDomain: "ayurprakrutiapp.firebaseapp.com",
  projectId: "ayurprakrutiapp",
  storageBucket: "ayurprakrutiapp.appspot.com",
  messagingSenderId: "532809638346",
  appId: "1:532809638346:web:acf33148b94bbf3e1cef33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);

// Export FieldValue for usage in Firestore operations - eye video
export { FieldValue, Timestamp };

// You can now use `auth` and `db` in your application for authentication and database operations.
