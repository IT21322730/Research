// src/firebase/auth.js

import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut} from "firebase/auth";

// Sign Up Function
export const handleSignup = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("User registered successfully!");
  } catch (err) {
    alert("Failed to register: " + err.message); // Display error message
  }
};

// Login Function
export const handleLogin = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true; // Indicate success
  } catch (err) {
    alert("Failed to log in: " + err.message); // Display error message
    return false; // Indicate failure
  }
};

// Sign Out Function
export const handleSignOut = async () => {
  try {
    await signOut(auth);
    alert("User signed out successfully!");
  } catch (err) {
    alert("Failed to log out: " + err.message);
  }
};
