// src/js/app.js
// Firebase front-end bootstrap (Vite / import.meta.env)
//
// Note: this file is meant to be processed by Vite (import.meta.env).
// Put your VITE_FIREBASE_* variables in .env (local) or Netlify env vars (deploy).

// Firebase modular SDK (browser CDN modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Read config from Vite env (VITE_...). These must be set in Netlify/Vite.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// initialize
const app = initializeApp(firebaseConfig);

// analytics is optional and will fail on some dev environments if not available
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // ignore analytics errors in dev
  // console.info('Analytics not available in this environment', e);
}

const auth = getAuth(app);
const db = getFirestore(app);

// -----------------
// Helper wrappers
// -----------------

/**
 * Create user account (Auth) and user profile document in 'users' collection
 * @param {string} email
 * @param {string} password
 * @param {string} role - 'patient' | 'labtech' | 'admin'
 * @returns firebase userCredential
 */
async function signupAndCreateProfile(email, password, role) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  // create user doc (id = uid)
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: email,
    role: role,
    createdAt: serverTimestamp()
  });
  return credential;
}

/**
 * Sign in user
 */
async function signIn(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out
 */
async function signOutUser() {
  return await signOut(auth);
}

/**
 * Safe check if email is already registered (returns boolean)
 */
async function isEmailRegistered(email) {
  const methods = await fetchSignInMethodsForEmail(auth, email);
  return methods && methods.length > 0;
}

/**
 * On auth state change with user profile fetch
 * callback receives { user, profile } or null
 */
function onAuthWithProfile(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(null);
    const udoc = await getDoc(doc(db, "users", user.uid));
    const profile = udoc.exists() ? udoc.data() : null;
    callback({ user, profile });
  });
}

/**
 * Get user role
 */
async function getUserRole(uid) {
  const udoc = await getDoc(doc(db, "users", uid));
  return udoc.exists() ? udoc.data().role : null;
}

/**
 * Create a lab case (simplified)
 * @param {Object} data - { patientId, patientEmail, reportedByUid, disease, notes, status }
 */
async function createLabCase(data) {
  const docRef = await addDoc(collection(db, "cases"), {
    ...data,
    status: data.status || "pending",
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Send chat message inside a conversation (chatId)
 */
async function sendChatMessage(chatId, fromUid, text) {
  const path = `chats/${chatId}/messages`;
  const ref = await addDoc(collection(db, path), {
    from: fromUid,
    text,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

/**
 * Listen to cases realtime - callback will be called with array of docs
 */
function listenToCases(callback, filter = {}) {
  // simple: listen to all cases (can be extended with query params)
  const q = query(collection(db, "cases"));
  return onSnapshot(q, (snap) => {
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(docs);
  });
}

// -----------------
// Exports (both raw firebase utilities and helpers)
// -----------------
export {
  app,
  auth,
  db,
  // firebase auth/firestore methods that other pages may import
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  fetchSignInMethodsForEmail,
  // firestore helpers
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  // wrappers
  signupAndCreateProfile,
  signIn,
  signOutUser,
  isEmailRegistered,
  onAuthWithProfile,
  getUserRole,
  createLabCase,
  sendChatMessage,
  listenToCases
};
// Note: analytics is not exported as it's optional
// export { analytics };
// -----------------
// End src/js/app.js