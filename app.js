// ======================
// Firebase SDK Imports
// ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ======================
// Firebase Configuration
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyAtDsSSp-YF-aQrRrpb0y4Cc-DnZc2nseA",
  authDomain: "telemed-0.firebaseapp.com",
  projectId: "telemed-0",
  storageBucket: "telemed-0.firebasestorage.app",
  messagingSenderId: "355517575874",
  appId: "1:355517575874:web:d6dc8e4a813dd3016fc15b",
  measurementId: "G-LWHE5TWF64"
};

// ======================
// Initialize Firebase
// ======================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======================
// Export for other scripts
// ======================
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, collection, addDoc, getDocs, query, where, onSnapshot, doc, updateDoc };
