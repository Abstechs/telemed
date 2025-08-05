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
        const { name, location, contactInfo } = JSON.parse(event.body);

        if (!name || !location || !contactInfo) {
            return { statusCode: 400, body: JSON.stringify({ error: "All fields are required" }) };
        }

        const db = admin.firestore();
        const docRef = await db.collection("hospitals").add({
            name,
            location,
            contactInfo,
            createdAt: new Date()
        });

        return { 
            statusCode: 200, 
            body: JSON.stringify({ success: true, id: docRef.id }) 
        };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};
