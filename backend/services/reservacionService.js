const db = require('../config/firebaseConfig');
const collection = db.collection('firebase');

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