// netlify/functions/addHospital.js
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountBase64) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env var (base64 encoded JSON).");
}

let app;
if (!global._firebaseAdminApp) {
  const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, "base64").toString("utf8"));
  app = initializeApp({ credential: cert(serviceAccount) });
  global._firebaseAdminApp = app;
} else {
  app = global._firebaseAdminApp;
}

const db = getFirestore(app);
const auth = getAuth(app);

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { authorization } = event.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
    }

    const idToken = authorization.split("Bearer ")[1];
    const decoded = await auth.verifyIdToken(idToken);

    // 🔑 Check if user has admin role in Firestore "users" collection
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists || userDoc.data().role !== "admin") {
      return { statusCode: 403, body: JSON.stringify({ message: "Forbidden — Admin only" }) };
    }

    const { name, location, contactEmail } = JSON.parse(event.body);

    if (!name || !location) {
      return { statusCode: 400, body: JSON.stringify({ message: "Name and location required" }) };
    }

    const newDoc = await db.collection("hospitals").add({
      name,
      location,
      contactEmail: contactEmail || null,
      createdAt: new Date(),
      createdBy: decoded.uid,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: newDoc.id, message: "Hospital added successfully" }),
    };
  } catch (err) {
    console.error("addHospital error", err);
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
}
// src/js/app.js