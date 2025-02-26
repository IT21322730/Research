// src/firebase.js

// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot,deleteDoc,doc,  getDoc, query,updateDoc, getDocs ,onAuthStateChanged } from "firebase/firestore";
import {Timestamp, FieldValue } from "firebase/firestore"; // <-- Added FieldValue
import { getStorage,ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
export const auth = getAuth(app);// Firebase Authentication
export const db = getFirestore(app);// Firestore Database
export const storage = getStorage(app);// Firebase Storage

// Export Firestore utilities
export { ref, uploadBytes, getDownloadURL,collection, addDoc,onSnapshot, deleteDoc,doc,getDoc, query,updateDoc,getDocs,onAuthStateChanged };

// Export FieldValue for usage in Firestore operations - eye video
export { FieldValue, Timestamp };

// You can now use `auth` and `db` in your application for authentication and database operations.
