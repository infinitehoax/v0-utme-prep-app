import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// REPLACE THESE WITH YOUR ACTUAL FIREBASE CONFIG KEYS
// Import the functions you need from the SDKs you need
const firebaseConfig = {
  apiKey: "AIzaSyCzvJUmkUpZZ4B4a7DFewp3Bc6p3aKpMmA",
  authDomain: "quiz-share-app.firebaseapp.com",
  projectId: "quiz-share-app",
  storageBucket: "quiz-share-app.firebasestorage.app",
  messagingSenderId: "482805667531",
  appId: "1:482805667531:web:dd10e635b4691ff8236d4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
