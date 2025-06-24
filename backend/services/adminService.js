const { FieldValue } = require('firebase-admin/firestore');
const db = require('../config/firebaseConfig');
const bcrypt = require('bcrypt');

const getAllAdmins = async () => {
    const snapshot = await db.collection('admins').get();
    const admins = [];

    snapshot.forEach(doc => {
        admins.push({ id: doc.id, ...doc.data() });
    });

    return admins;
};

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

    if(data.intentos == 3){
        throw new Error('BLOCKED_ACCOUNT');
    }

    const passwordMatch = await bcrypt.compare(contra, data.contra);
    if (!passwordMatch) {
        await doc.ref.update({ intentos: FieldValue.increment(1) });
        return null;
    }

    await doc.ref.update({ intentos: 0 });

    return data;
};

const changePasswordAdmin = async (id, username, contra, nuevaContra) => {
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
    if (passwordMatch && contra == nuevaContra) {
        throw new Error('SAME_PASSWORD');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevaContra, saltRounds);

    await doc.ref.update({
        contra: hashedPassword,
        intentos: 0
    });

    return data;
}

module.exports = {
    getAllAdmins,
    loginWithAdminCredentials,
    changePasswordAdmin
};
