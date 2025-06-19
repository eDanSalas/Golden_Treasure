const db = require('../config/firebaseConfig');

const getAllAdmins = async () => {
    const snapshot = await db.collection('users').get();
    const admins = [];

    snapshot.forEach(doc => {
        admins.push({ id: doc.id, ...doc.data() });
    });

    return admins;
};

module.exports = {
    getAllAdmins
};