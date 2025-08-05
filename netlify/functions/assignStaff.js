const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { email, role, hospitalId } = JSON.parse(event.body);

        if (!email || !role || !hospitalId) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };
        }

        const db = admin.firestore();
        const snapshot = await db.collection("users").where("email", "==", email).get();

        if (snapshot.empty) {
            return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
        }

        const userDoc = snapshot.docs[0];
        await db.collection("users").doc(userDoc.id).update({
            role,
            hospitalId
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};
