// src/db.jsx

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Adjust the import path as necessary

// Function to add user data
export const addUserData = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), userData);
    console.log("User data saved!");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Function to get user data by userId
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
};

// You can add more functions here as needed, such as updateUserData, deleteUserData, etc.
