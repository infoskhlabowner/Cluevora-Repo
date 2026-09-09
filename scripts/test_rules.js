const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require('fs');
const serviceAccount = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
async function run() {
  try {
     const doc = await db.collection("users").doc("B8U7z6T9QoQZ2t8v2NqG").get();
     console.log(doc.data());
  } catch(e) { console.error(e) }
}
run();
