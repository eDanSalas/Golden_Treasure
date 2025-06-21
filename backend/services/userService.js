const db = require('../config/firebaseConfig');
const bcrypt = require('bcrypt');

const getAllAdmins = async () => {
    const snapshot = await db.collection('users').get();
    const admins = [];

    snapshot.forEach(doc => {
        admins.push({ id: doc.id, ...doc.data() });
    });

    return admins;
};

const createClient = async (clienteData) => {
    const clientesRef = db.collection('users');

    // 1. Search the last inserted ID
    const snapshot = await clientesRef.orderBy('ID', 'desc').limit(1).get();

    let nextId = 1;
    if (!snapshot.empty) {
        const lastDoc = snapshot.docs[0];
        const lastId = lastDoc.data().ID;
        nextId = lastId + 1;
    }

    // 2. Hash the password for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(clienteData.contra, saltRounds);

    // 3. Make the object to insert
    const newCliente = {
        ID: nextId,
        nombre: clienteData.nombre,
        correo: clienteData.correo,
        contra: hashedPassword
    };

    // 4. Insert the new client in the database
    const docRef = await clientesRef.add(newCliente);
    return { id: docRef.id, ...newCliente };
};

const createReservation = async (userData) => {
    const { numero_reservacion } = userData;

    // Search if that reservation number exist
    const snapshot = await db.collection('reservations')
        .where('numero_reservacion', '==', numero_reservacion)
        .get();

    if (!snapshot.empty) {
        throw new Error('DUPLICATE_RESERVATION');
    }

    // If doesn't exist, we add it
    const userRef = await db.collection('users').add(userData);
    return { id: userRef.id };
};

const loginWithCredentials = async (id, contra) => {
    const snapshot = await db
        .collection('Clientes')
        .where('ID', '==', id)
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
    getAllAdmins,
    createClient,
    createReservation,
    loginWithCredentials
};