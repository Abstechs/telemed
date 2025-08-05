const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

exports.handler = async () => {
    try {
        const db = admin.firestore();
        const snapshot = await db.collection("hospitals").get();

        const hospitals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(hospitals)
        };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};
