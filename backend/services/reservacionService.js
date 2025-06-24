const db = require('../config/firebaseConfig');
const collection = db.collection('firebase');

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
    const userRef = await db.collection('reservations').add(userData);
    return { id: userRef.id };
};

const getAllReservaciones = async () => {
    const snapshot = await collection.get();
    const datos = [];
    snapshot.forEach(doc => {
        datos.push({ id: doc.id, ...doc.data() });
    });
    return datos;
};

const updateReservacion = async (id, nuevosDatos) => {
    const docRef = collection.doc(id);
    await docRef.update(nuevosDatos);
};

const deleteReservacion = async (id) => {
    await collection.doc(id).delete();
};

module.exports = {
    createReservation,
    getAllReservaciones,
    updateReservacion,
    deleteReservacion
};