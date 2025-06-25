const admin = require('firebase-admin');
const db = require('../config/firebaseConfig');
const collection = db.collection('formulario_habitacion');

const createReservation = async (reservationData) => {
    const snapshot = await db.collection('formulario_habitacion')
        .orderBy('no_reservacion', 'desc')
        .limit(1)
        .get();

    let newNoReservacion = 1;
    if (!snapshot.empty) {
        const lastDoc = snapshot.docs[0];
        const lastNo = lastDoc.data().no_reservacion;
        newNoReservacion = lastNo + 1;
    }

    const finalReservationData = {
        ...reservationData,
        no_reservacion: newNoReservacion
    };

    const docRef = await db.collection('formulario_habitacion').add(finalReservationData);
    return { id: docRef.id, no_reservacion: newNoReservacion };
};

const getReservacionId = async (id) => {
    const snapshot = await collection.where('id', '==', id).limit(1).get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
}

const getAllReservaciones = async () => {
    const snapshot = await collection.get();
    const datos = [];
    snapshot.forEach(doc => {
        datos.push({ id: doc.id, ...doc.data() });
    });
    return datos;
};

const updateReservacion = async (id, nuevosDatos) => {
    const snapshot = await collection.where('id', '==', id).limit(1).get();

    if (snapshot.empty) {
        throw new Error('No se encontró la reservación con ese id');
    }

    const docRef = snapshot.docs[0].ref;
    await docRef.update(nuevosDatos);
};

const deleteReservacion = async (id) => {
    const snapshot = await collection.where('id', '==', id).limit(1).get();

    if (snapshot.empty) {
        throw new Error('No se encontró la reservación con ese id');
    }

    const docRef = snapshot.docs[0].ref;
    await docRef.delete();
};

module.exports = {
    createReservation,
    getReservacionId,
    getAllReservaciones,
    updateReservacion,
    deleteReservacion
};