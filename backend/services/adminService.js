const db = require('../config/firebaseConfig');
const bcrypt = require('bcrypt');

const loginWithAdminCredentials = async (id, username, contra) => {
    const snapshot = await db
        .collection('admins')
        .where('id', '==', id)
        .where('username', '==', username)
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    const passwordMatch = await bcrypt.compare(contra, data.contra);
    if (!passwordMatch) return null;

    return data;
};

module.exports = {
    loginWithAdminCredentials
};
