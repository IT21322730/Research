// src/types/firebase.d.ts

declare module '../firebase' {
    import { Auth } from 'firebase/auth';
    import { Firestore } from 'firebase/firestore';
    import { FirebaseStorage } from 'firebase/storage';
  
    export const auth: Auth;
    export const db: Firestore;
    export const storage: FirebaseStorage;
    export { 
      ref, 
      uploadBytes, 
      getDownloadURL, 
      collection, 
      addDoc, 
      onSnapshot, 
      deleteDoc, 
      doc, 
      getDoc, 
      query, 
      updateDoc, 
      getDocs, 
      where, 
      FieldValue, 
      Timestamp 
    } from 'firebase/firestore';
  }
  