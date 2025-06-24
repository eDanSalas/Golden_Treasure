const { FieldValue } = require('firebase-admin/firestore');
const db = require('../config/firebaseConfig');
const bcrypt = require('bcrypt');

const createClient = async (clienteData) => {
    const clientesRef = db.collection('users');

    // 1. Search the last inserted ID
    const snapshot = await clientesRef.orderBy('id', 'desc').limit(1).get();

    let nextId = 1;
    if (!snapshot.empty) {
        const lastDoc = snapshot.docs[0];
        const lastId = lastDoc.data().id;
        nextId = lastId + 1;
    }

    // 2. Hash the password for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(clienteData.contra, saltRounds);

    // 3. Make the object to insert
    const newCliente = {
        id: nextId,
        nombre: clienteData.nombre,
        correo: clienteData.correo,
        contra: hashedPassword,
        intentos: 0
    };

    // 4. Insert the new client in the database
    const docRef = await clientesRef.add(newCliente);
    return { id: docRef.id, ...newCliente };
};

const createClientGoogle = async (clienteData) => {
    const clientesRef = db.collection('users');

    const snapshot = await clientesRef.orderBy('id', 'desc').limit(1).get();

    let nextId = 1;
    if (!snapshot.empty) {
        const lastDoc = snapshot.docs[0];
        const lastId = lastDoc.data().id;
        nextId = lastId + 1;
    }

    const newCliente = {
        id: nextId,
        nombre: clienteData.nombre,
        correo: clienteData.correo,
        intentos: 0
    };

    const docRef = await clientesRef.add(newCliente);
    return { id: docRef.id, ...newCliente };
};

const loginWithCredentials = async (id, contra) => {
    const snapshot = await db
        .collection('users')
        .where('id', '==', id)
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

    return data;
};

const changePassword = async (id, nombre, contra, nuevaContra) => {
    const snapshot = await db
        .collection('users')
        .where('id', '==', id)
        .where('nombre', '==', nombre)
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

const obtenerClienteId = async (id) => {
    const snapshot = await db
        .collection('users')
        .where('id', '==', id)
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};

module.exports = {
    createClient,
    loginWithCredentials,
    changePassword,
    obtenerClienteId
};