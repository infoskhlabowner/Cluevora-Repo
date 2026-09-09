const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
async function run() {
  const users = await db.collection('users').get();
  users.forEach(doc => {
    if (doc.data().email === 'info.skhlabs@gmail.com') {
      console.log('USER:', doc.id, doc.data());
    }
  });
}
run();
